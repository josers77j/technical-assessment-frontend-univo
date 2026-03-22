export interface Provider {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsArray: Provider[];
}
