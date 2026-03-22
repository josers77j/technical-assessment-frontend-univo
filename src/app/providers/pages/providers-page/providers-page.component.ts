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
import { ProviderTableComponent } from '../../components/provider-table/provider-table.component';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-providers-page.component',
  imports: [
    RouterLink,
    TitleComponent,
    LimitComponent,
    PaginationComponent,
    ProviderTableComponent,
    ErrorBannerComponent,
    DeleteActionModalComponent,
    AlertComponent,
  ],
  templateUrl: './providers-page.component.html',
})
export class ProvidersPageComponent {
  private readonly route = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly queryClient = inject(QueryClient);
  private readonly providerService = inject(ProviderService);
  private readonly paginationService = inject(PaginationService);
  private readonly deleteModalService = inject(DeleteActionModalService);
  private readonly alertService = inject(AlertService);

  queryParamsSignal = toSignal(this.activatedRoute.queryParamMap, {
    initialValue: this.activatedRoute.snapshot.queryParamMap,
  });

  limitPerPage = signal<number>(10);
  searchFilter = signal<string>('');
  pendingDeleteId = signal<number>(0);

  synchronizedUrlSearchParams = effect(() => {
    const queryMap = this.queryParamsSignal();
    const filter = queryMap.get('filter') ?? '';
    const limit = Number(queryMap.get('limit') ?? 10);

    this.searchFilter.set(filter);
    this.limitPerPage.set(Number.isNaN(limit) ? 10 : limit);
  });

  providersQuery = injectQuery(() => ({
    queryKey: [
      'providers',
      this.limitPerPage(),
      this.paginationService.currentPage(),
      this.searchFilter(),
    ],
    queryFn: () =>
      firstValueFrom(
        this.providerService.getProviders(
          this.paginationService.currentPage(),
          this.limitPerPage(),
          this.searchFilter(),
        ),
      ),
    staleTime: 5000 * 60,
  }));

  titleData = computed(() => ({
    name: 'Proveedores',
    count: this.providersQuery.data()?.totalItems ?? 0,
  }));

  onSearch(filter: string) {
    this.searchFilter.set(filter);
    this.setSearchParamInUrl(1);
  }

  onClear() {
    this.searchFilter.set('');
    this.setSearchParamInUrl(1);
  }

  onNewLimit(newLimit: number) {
    this.limitPerPage.set(newLimit);
    this.setSearchParamInUrl(1);
  }

  setSearchParamInUrl(page = 1) {
    this.route.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page,
        limit: this.limitPerPage(),
        filter: this.searchFilter(),
      },
      queryParamsHandling: 'merge',
    });
  }

  deleteProviderEffect = effect(() => {
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
      firstValueFrom(this.providerService.deleteProvider(id)),
    onSuccess: () => {
      this.deleteModalService.state.set('finished');
      this.queryClient.invalidateQueries({ queryKey: ['providers'] });
      this.pendingDeleteId.set(0);
      this.alertService.showSuccess('Proveedor eliminado con éxito');
    },
    onError: (exception) => {
      this.deleteModalService.state.set('finished');
      this.alertService.showError(`Error: ${exception.message}`);
    },
  }));
}
