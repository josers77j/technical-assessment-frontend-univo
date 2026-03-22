import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component';

@Component({
  selector: 'app-product-page.component',
  imports: [ProductDetailPageComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  productId = computed(() => this.getSafeProductId());
  isEditMode = computed(() => this.productId() > 0);

  productQuery = injectQuery(() => ({
    queryKey: ['product', this.productId()],
    queryFn: () =>
      firstValueFrom(this.productService.getProductById(this.productId())),
    staleTime: 0,
    refetchOnMount: 'always',
  }));

  private getSafeProductId(): number {
    const rawId = this.route.snapshot.paramMap.get('id');
    const parsedId = Number(rawId ?? 0);

    return Number.isFinite(parsedId) && parsedId > 0 ? parsedId : 0;
  }
}
