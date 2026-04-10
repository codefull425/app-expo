import { normalizeCatalogPath } from './resolveApiBaseUrl';
import { requestJson } from './http';
import type { CategoryDto } from './types';

export type DeleteCatalogItemInput = {
  categoryId: string;
  itemId: string;
};

export async function deleteCatalogItem(input: DeleteCatalogItemInput): Promise<void> {
  const basePath = normalizeCatalogPath(process.env.EXPO_PUBLIC_API_CATALOG_PATH);
  const prefix = basePath.replace(/\/$/, '') || '/categories';
  const one = `${prefix}/${encodeURIComponent(input.categoryId)}`;

  const cat = await requestJson<CategoryDto>(one, { method: 'GET' });
  const prev = Array.isArray(cat.items) ? cat.items : [];
  const items = prev.filter((i) => i.id !== input.itemId);

  if (items.length === prev.length) {
    throw new Error('Item não encontrado na categoria.');
  }

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
