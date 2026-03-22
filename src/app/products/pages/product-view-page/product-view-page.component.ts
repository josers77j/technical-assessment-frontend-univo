import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-view-page',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './product-view-page.component.html',
})
export class ProductViewPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  productId = computed(() =>
    Number(this.route.snapshot.paramMap.get('id') ?? 0),
  );

  productQuery = injectQuery(() => ({
    queryKey: ['product-view', this.productId()],
    queryFn: () =>
      firstValueFrom(this.productService.getProductById(this.productId())),
    staleTime: 0,
    refetchOnMount: 'always',
  }));
}
