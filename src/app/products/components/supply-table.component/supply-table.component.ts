import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { RouterLink } from '@angular/router';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'product-table',
  imports: [CurrencyPipe, SkeletonComponent, RouterLink],
  templateUrl: './supply-table.component.html',
})
export class ProductTableComponent {
  products = input<Product[]>([]);
  isLoading = input<boolean>(false);
  skeletonLimit = input<number>(10);

  deleteClicked = output<number>();

  onDelete(id: number) {
    this.deleteClicked.emit(id);
  }
}
