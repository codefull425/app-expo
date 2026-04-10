/**
 * Cardápio só é montado a partir da resposta HTTP do json-server (sem fallback local).
 * GET explícito em `/categories` (nunca `/items`; ver `http.ts` e `api-server.js`).
 */
import { normalizeCatalogPath } from './resolveApiBaseUrl';
import { requestJson } from './http';
import { mapCategoryDto } from './mappers';
import { CATALOG_PATH } from './config';
import type { CatalogCategory, CatalogResponseDto, CategoryDto, ItemDto } from './types';

/** Aceita `{ "categories": [...] }` ou um array de categorias (ex.: json-server em `/categories`). */
function normalizeToCategoryDtos(data: unknown): CategoryDto[] {
  if (Array.isArray(data)) {
    return data as CategoryDto[];
  }
  if (
    data &&
    typeof data === 'object' &&
    'categories' in data &&
    Array.isArray((data as CatalogResponseDto).categories)
  ) {
    return (data as CatalogResponseDto).categories;
  }
  throw new Error(
    'Formato de catálogo inválido: esperado { "categories": [...] } ou um array de categorias.',
  );
}

export async function fetchCatalog(): Promise<CatalogCategory[]> {
  const path = normalizeCatalogPath(process.env.EXPO_PUBLIC_API_CATALOG_PATH);
  const data = await requestJson<unknown>(path, { method: 'GET' });
  return normalizeToCategoryDtos(data).map(mapCategoryDto);
}
