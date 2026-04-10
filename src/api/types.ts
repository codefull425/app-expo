export type CatalogResponseDto = {
  categories: CategoryDto[];
};

export type CategoryDto = {
  id: string;
  name: string;
  items: ItemDto[];
};

export type ItemDto = {
  id: string;
  name: string;
  description: string;
  price?: string;
  price_value?: number;
  price_cents?: number;
  image_url?: string | null;
};

export type CatalogItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl?: string;
  priceCents?: number;
};

export type CatalogCategory = {
  id: string;
  label: string;
  items: CatalogItem[];
};
