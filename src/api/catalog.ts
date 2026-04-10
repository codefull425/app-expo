import { normalizeCatalogPath } from './resolveApiBaseUrl';
import { requestJson } from './http';
import { mapCategoryDto } from './mappers';
import type { CatalogCategory, CatalogResponseDto, CategoryDto } from './types';

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
