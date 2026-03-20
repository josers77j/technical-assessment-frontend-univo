import { Routes } from '@angular/router';

import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';

export const ProductRoutes: Routes = [
  {
    path: 'list',
    component: ProductsPageComponent,
  },
  {
    path: 'detail/:id',
    component: ProductPageComponent,
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];

export default ProductRoutes;
