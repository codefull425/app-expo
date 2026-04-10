/** Resposta JSON esperada do GET do catálogo (ajuste quando o contrato real existir). */
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
  /** Preço já formatado para exibição */
  price?: string;
  /** Preço numérico em reais (ex.: 10.5) */
  price_value?: number;
  /** Preço em centavos (ex.: 1000 = R$ 10,00) */
  price_cents?: number;
  image_url?: string | null;
};

/** Modelo usado pela UI após o mapper */
export type CatalogItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl?: string;
  /** Centavos vindos da API — usado para pré-preencher edição com precisão. */
  priceCents?: number;
};

export type CatalogCategory = {
  id: string;
  label: string;
  items: CatalogItem[];
};
