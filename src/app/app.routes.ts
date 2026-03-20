import { Routes } from '@angular/router';
import { SidebarComponent } from './shared/layouts/sidebar/sidebar.component';

export const routes: Routes = [
  {
    path: '',
    component: SidebarComponent,
    children: [
      {
        path: 'products',
        loadChildren: () => import('./products/product.routes'),
      },
      {
        path: 'providers',
        loadChildren: () => import('./providers/provider.routes'),
      },
      {
        path: '**',
        redirectTo: 'products/list',
      },
    ],
  },
];
