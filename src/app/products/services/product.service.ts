import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { Product, ProductResponse } from '../interfaces/product.interface';
import { SearchParams } from '../interfaces/search-param.interface';
import { catchError, map, Observable, of, throwError } from 'rxjs';

const baseUrl = environment.baseUrl;

export const emptyProduct: Product = {
  id: 0,
  name: '',
  sku: '',
  price: '0',
  stockQuantity: 0,
  description: '',
  providerId: 0,
  createdAt: '',
  updatedAt: '',
  dimensions: '',
  category: '',
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);
  productIdSelected = signal<number>(0);

  getProducts(page: number, limit: number, appliedSearchParams: SearchParams) {
    const { priceMax, priceMin, filter, sort, fields } = appliedSearchParams;
    return this.http
      .get<unknown>(`${baseUrl}/products`, {
        params: {
          page,
          limit,
          priceMax: priceMax ?? '',
          priceMin: priceMin ?? '',
          filter: filter ?? '',
          sort: sort ?? '',
          fields: fields ?? '',
        },
      })
      .pipe(
        map((response) => this.normalizeListResponse(response)),
        catchError((exception) => {
          return throwError(() => ({
            message: exception['error'].message,
            status: exception['error'].statusCode,
          }));
        }),
      );
  }

  create(createProduct: Partial<Product>): Observable<Product> {
    return this.http.post<unknown>(`${baseUrl}/products`, createProduct).pipe(
      map((response) => this.unwrapEntity(response) as Product),
      catchError((exception) => {
        return throwError(() => ({
          message: exception['error'].message,
          status: exception['error'].statusCode,
        }));
      }),
    );
  }

  update(id: number, updateProduct: Partial<Product>): Observable<Product> {
    return this.http
      .patch<unknown>(`${baseUrl}/products/${id}`, updateProduct)
      .pipe(
        map((response) => this.unwrapEntity(response) as Product),
        catchError((exception) => {
          return throwError(() => ({
            message: exception['error'].message,
            status: exception['error'].statusCode,
          }));
        }),
      );
  }

  getProductById(id: number): Observable<Product> {
    if (id === 0) return of(emptyProduct);

    return this.http.get<unknown>(`${baseUrl}/products/${id}`).pipe(
      map((response) => this.unwrapEntity(response) as Product),
      catchError((exception) => {
        return throwError(() => ({
          message: exception['error'].message,
          status: exception['error'].statusCode,
        }));
      }),
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${baseUrl}/products/${id}`).pipe(
      catchError((exception) => {
        return throwError(() => ({
          message: exception['error'].message,
          status: exception['error'].statusCode,
        }));
      }),
    );
  }

  private normalizeListResponse(response: unknown): ProductResponse {
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
