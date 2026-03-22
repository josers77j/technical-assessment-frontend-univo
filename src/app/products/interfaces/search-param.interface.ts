export interface SearchParams {
  priceMax: string | null;
  priceMin: string | null;
  filter?: string | null;
  sort?: string | null;
  fields?: string | null;
}
