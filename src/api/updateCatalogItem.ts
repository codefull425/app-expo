import { normalizeCatalogPath } from './resolveApiBaseUrl';
import { requestJson } from './http';
import type { CategoryDto, ItemDto } from './types';

export type UpdateCatalogItemInput = {
  categoryId: string;
  itemId: string;
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
};

export async function updateCatalogItem(input: UpdateCatalogItemInput): Promise<void> {
  const basePath = normalizeCatalogPath(process.env.EXPO_PUBLIC_API_CATALOG_PATH);
  const prefix = basePath.replace(/\/$/, '') || '/categories';
  const one = `${prefix}/${encodeURIComponent(input.categoryId)}`;

  const cat = await requestJson<CategoryDto>(one, { method: 'GET' });
  const items = Array.isArray(cat.items) ? [...cat.items] : [];
  const idx = items.findIndex((i) => i.id === input.itemId);
  if (idx === -1) {
    throw new Error('Item não encontrado na categoria.');
  }

  const prev = items[idx]!;
  const trimmedUrl = input.imageUrl?.trim() ?? '';
  const updated: ItemDto = {
    ...prev,
    id: prev.id,
    name: input.name.trim(),
    description: (input.description ?? '').trim(),
    price_cents: input.priceCents,
    price: undefined,
    image_url: trimmedUrl.length > 0 ? trimmedUrl : null,
  };
  items[idx] = updated;

  await requestJson(one, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: cat.id,
      name: cat.name,
      items,
    }),
  });
}
