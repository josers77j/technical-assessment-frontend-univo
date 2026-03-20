import { Routes } from '@angular/router';
import { ProvidersPageComponent } from './pages/providers-page/providers-page.component';
import { ProviderPageComponent } from './pages/provider-page/provider-page.component';

export const ProviderRoutes: Routes = [
  {
    path: 'list',
    component: ProvidersPageComponent,
  },
  {
    path: 'detail/:id',
    component: ProviderPageComponent,
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];

export default ProviderRoutes;
