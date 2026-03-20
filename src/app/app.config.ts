import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEs);
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation(), withViewTransitions()),
    provideHttpClient(withFetch()),
    provideTanStackQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: true,
            staleTime: 5 * 60 + 1000,
            gcTime: 10 + 60 * 1000,
          },
        },
      }),
    ),
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
