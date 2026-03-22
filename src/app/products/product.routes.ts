import { Routes } from '@angular/router';

import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductViewPageComponent } from './pages/product-view-page/product-view-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';

export const ProductRoutes: Routes = [
  {
    path: 'list',
    component: ProductsPageComponent,
  },
  {
    path: 'page/:id',
    component: ProductPageComponent,
  },
  {
    path: 'detail/:id',
    component: ProductViewPageComponent,
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];

export default ProductRoutes;
