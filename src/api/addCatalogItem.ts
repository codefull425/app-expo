import { normalizeCatalogPath } from './resolveApiBaseUrl';
import { requestJson } from './http';
import type { CategoryDto, ItemDto } from './types';

export type AddCatalogItemInput = {
  categoryId: string;
  name: string;
  /** Opcional no formulário; envia string vazia no JSON. */
  description?: string;
  /** Preço em centavos (inteiro). */
  priceCents: number;
  imageUrl?: string;
};

/**
 * Lê a categoria, acrescenta um item no formato do `server.json` e grava com PUT
 * (evita merge incorreto de arrays no PATCH do json-server).
 */
export async function addCatalogItem(input: AddCatalogItemInput): Promise<void> {
  const basePath = normalizeCatalogPath(process.env.EXPO_PUBLIC_API_CATALOG_PATH);
  const prefix = basePath.replace(/\/$/, '') || '/categories';
  const one = `${prefix}/${encodeURIComponent(input.categoryId)}`;

  const cat = await requestJson<CategoryDto>(one, { method: 'GET' });
  const items = Array.isArray(cat.items) ? [...cat.items] : [];

  const newId = `item-${Date.now()}`;
  const newItem: ItemDto = {
    id: newId,
    name: input.name.trim(),
    description: (input.description ?? '').trim(),
    price_cents: input.priceCents,
    ...(input.imageUrl?.trim()
      ? { image_url: input.imageUrl.trim() }
      : {}),
  };

  await requestJson(one, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: cat.id,
      name: cat.name,
      items: [...items, newItem],
    }),
  });
}
