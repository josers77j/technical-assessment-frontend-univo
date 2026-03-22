import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Provider, ProviderResponse } from '../interfaces/provider.interface';

const baseUrl = environment.baseUrl;

export const emptyProvider: Provider = {
  id: 0,
  name: '',
  address: '',
  phone: '',
  description: '',
  createdAt: '',
  updatedAt: '',
};

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private readonly http = inject(HttpClient);
  providerIdSelected = signal<number>(0);

  getProviders(page: number, limit: number, filter: string | null = null) {
    return this.http
      .get<unknown>(`${baseUrl}/providers`, {
        params: {
          page,
          limit,
          filter: filter ?? '',
        },
      })
      .pipe(
        map((response) => this.normalizeListResponse(response)),
        catchError((exception) => {
          return throwError(() => ({
            message: exception['error']?.message ?? 'Error inesperado',
            status: exception['error']?.statusCode ?? 500,
          }));
        }),
      );
  }

  getProviderById(id: number): Observable<Provider> {
    if (id === 0) return of(emptyProvider);

    return this.http.get<unknown>(`${baseUrl}/providers/${id}`).pipe(
      map((response) => this.unwrapEntity(response) as Provider),
      catchError((exception) => {
        return throwError(() => ({
          message: exception['error']?.message ?? 'Error inesperado',
          status: exception['error']?.statusCode ?? 500,
        }));
      }),
    );
  }

  create(payload: Partial<Provider>): Observable<Provider> {
    return this.http.post<unknown>(`${baseUrl}/providers`, payload).pipe(
      map((response) => this.unwrapEntity(response) as Provider),
      catchError((exception) => {
        return throwError(() => ({
          message: exception['error']?.message ?? 'Error inesperado',
          status: exception['error']?.statusCode ?? 500,
        }));
      }),
    );
  }

  update(id: number, payload: Partial<Provider>): Observable<Provider> {
    return this.http.patch<unknown>(`${baseUrl}/providers/${id}`, payload).pipe(
      map((response) => this.unwrapEntity(response) as Provider),
      catchError((exception) => {
        return throwError(() => ({
          message: exception['error']?.message ?? 'Error inesperado',
          status: exception['error']?.statusCode ?? 500,
        }));
      }),
    );
  }

  deleteProvider(id: number) {
    return this.http.delete(`${baseUrl}/providers/${id}`).pipe(
      catchError((exception) => {
        return throwError(() => ({
          message: exception['error']?.message ?? 'Error inesperado',
          status: exception['error']?.statusCode ?? 500,
        }));
      }),
    );
  }

  private normalizeListResponse(response: unknown): ProviderResponse {
    const value = response as any;

    if (value?.itemsArray) {
      return {
        currentPage: Number(value.currentPage ?? 1),
        totalPages: Number(value.totalPages ?? 1),
        totalItems: Number(value.totalItems ?? value.itemsArray.length ?? 0),
        itemsArray: value.itemsArray,
      };
    }

    if (Array.isArray(value?.data)) {
      return {
        currentPage: Number(value?.meta?.page ?? value?.currentPage ?? 1),
        totalPages: Number(value?.meta?.totalPages ?? value?.totalPages ?? 1),
        totalItems: Number(
          value?.meta?.total ?? value?.totalItems ?? value.data.length ?? 0,
        ),
        itemsArray: value.data,
      };
    }

    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsArray: [],
    };
  }

  private unwrapEntity(response: unknown): unknown {
    const value = response as any;
    return value?.data ?? value;
  }
}
