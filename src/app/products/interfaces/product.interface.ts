export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sku?: string;
  stockQuantity?: number;
  category?: string;
  dimensions?: string;
  providerId: number;
  provider?: Provider;
}

export interface ProductResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsArray: Product[];
}

export type Products = Product;

export interface Provider {
  id: number;
  name: string;
}
