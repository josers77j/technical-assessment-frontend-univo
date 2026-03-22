import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { DeleteActionModalComponent } from '../../../shared/components/delete-action-modal/delete-action-modal.component';
import { DeleteActionModalService } from '../../../shared/components/delete-action-modal/deleteActionModal.service';
import { ErrorBannerComponent } from '../../../shared/components/error-banner/error-banner.component';
import { LimitComponent } from '../../../shared/components/limit/limit.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PaginationService } from '../../../shared/components/pagination/pagination.service';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { SearchParams } from '../../interfaces/search-param.interface';
import { ProductService } from '../../services/product.service';
import { ProductTableComponent } from '../../components/supply-table.component/supply-table.component';

@Component({
  selector: 'app-products-page',
  imports: [
    LimitComponent,
    PaginationComponent,
    AlertComponent,
    TitleComponent,
    RouterLink,
    ProductTableComponent,
    ErrorBannerComponent,
    DeleteActionModalComponent,
  ],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent {
  route = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  queryClient = inject(QueryClient);
  productService = inject(ProductService);
  paginationService = inject(PaginationService);
  deleteModalService = inject(DeleteActionModalService);
  alertService = inject(AlertService);

  limitPerPage = signal<number>(10);
  selectedFilter = signal<string>('');
  pendingDeleteId = signal<number>(0);
  isOpen = signal<boolean>(false);

  openToggle() {
    this.isOpen.update((value) => !value);
  }

  queryParamsSignal = toSignal(this.activatedRoute.queryParamMap, {
    initialValue: this.activatedRoute.snapshot.queryParamMap,
  });

  urlSearchParams = computed(() => {
    const map = this.queryParamsSignal();
    const priceMax = map.get('priceMax');
    const priceMin = map.get('priceMin');
    const filter = map.get('filter');
    const sort = map.get('sort');
    const fields = map.get('fields');

    return {
      params: {
        priceMax,
        priceMin,
        filter,
        sort,
        fields,
      } as SearchParams,
      limit: Number(map.get('limit') ?? 10),
    };
  });

  formSearchParams = signal<SearchParams>({
    priceMax: null,
    priceMin: null,
    filter: null,
    sort: null,
    fields: null,
  });
  appliedSearchParams = signal<SearchParams>(this.formSearchParams());

  synchronizedUrlSearchParams = effect(() => {
    const params = this.urlSearchParams().params;
    const limit = this.urlSearchParams().limit;

    this.formSearchParams.set(params);
    this.appliedSearchParams.set(params);
    this.selectedFilter.set(params.filter ?? '');
    this.limitPerPage.set(Number.isNaN(limit) ? 10 : limit);
  });

  setFilter(filter: string) {
    this.formSearchParams.update((params) => ({
      ...params,
      filter,
    }));
  }

  setFields(fields: string) {
    this.formSearchParams.update((params) => ({
      ...params,
      fields: fields || null,
    }));
  }

  setPriceMin(priceMin: string) {
    this.formSearchParams.update((params) => ({
      ...params,
      priceMin: priceMin || null,
    }));
  }

  setPriceMax(priceMax: string) {
    this.formSearchParams.update((params) => ({
      ...params,
      priceMax: priceMax || null,
    }));
  }

  setSort(sort: string) {
    this.formSearchParams.update((params) => ({
      ...params,
      sort: sort || null,
    }));
  }

  onSearch() {
    const params = this.formSearchParams();
    this.setSearchParamInUrl(params, 1);
    this.appliedSearchParams.set(params);
  }

  clearSearch() {
    const params: SearchParams = {
      priceMax: null,
      priceMin: null,
      filter: null,
      sort: null,
      fields: null,
    };

    this.formSearchParams.set(params);
    this.appliedSearchParams.set(params);
    this.selectedFilter.set('');
    this.setSearchParamInUrl(params, 1);
  }

  onNewLimit(newLimit: number) {
    this.limitPerPage.set(newLimit);
    this.setSearchParamInUrl(this.formSearchParams(), 1);
  }

  productsQuery = injectQuery(() => ({
    queryKey: [
      'products',
      this.limitPerPage(),
      this.paginationService.currentPage(),
      this.appliedSearchParams(),
    ],

    queryFn: () =>
      firstValueFrom(
        this.productService.getProducts(
          this.paginationService.currentPage(),
          this.limitPerPage(),
          this.appliedSearchParams(),
        ),
      ),
    staleTime: 5000 * 60,
  }));

  titleData = computed(() => ({
    name: 'Productos',
    count: this.productsQuery.data()?.totalItems ?? 0,
  }));

  setSearchParamInUrl(searchParams?: SearchParams, page = 1) {
    this.route.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page,
        limit: this.limitPerPage(),
        priceMax: this.sanitizedNumber(searchParams?.priceMax),
        priceMin: this.sanitizedNumber(searchParams?.priceMin),
        filter: searchParams?.filter,
        sort: searchParams?.sort,
        fields: searchParams?.fields,
      },
      queryParamsHandling: 'merge',
    });
  }

  deleteProductEffect = effect(() => {
    if (this.deleteModalService.state() === 'confirming') {
      this.onDeleteConfirmed();
    }
  });

  openDeleteModal(id: number) {
    this.pendingDeleteId.set(id);
    const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
    dialog?.showModal();
  }

  onDeleteConfirmed() {
    const id = this.pendingDeleteId();
    if (!id) {
      this.deleteModalService.state.set('finished');
      return;
    }

    this.deleteModalService.state.set('loading');
    this.mutationDelete.mutate(id);
  }

  mutationDelete = injectMutation(() => ({
    mutationFn: (id: number) =>
      firstValueFrom(this.productService.deleteProduct(id)),
    onSuccess: () => {
      this.deleteModalService.state.set('finished');
      this.queryClient.invalidateQueries({ queryKey: ['products'] });
      this.pendingDeleteId.set(0);
      this.alertService.showSuccess('Producto eliminado con éxito');
    },
    onError: (exception) => {
      this.deleteModalService.state.set('finished');
      this.alertService.showError(`Error: ${exception.message}`);
    },
  }));

  sanitizedNumber(value?: string | number | null) {
    if (value === null || value === undefined || value === '') return null;

    const sanitizedValue = Number(value); // or +value
    return Number.isFinite(sanitizedValue) ? sanitizedValue : null;
  }
}
