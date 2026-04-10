import { normalizeCatalogPath, resolveApiBaseUrl } from './resolveApiBaseUrl';

export {
  JSON_SERVER_DEFAULT_BASE_URL,
  JSON_SERVER_DEFAULT_CATALOG_PATH,
} from './resolveApiBaseUrl';

export function getApiBaseUrl(): string {
  return resolveApiBaseUrl();
}

export const CATALOG_PATH = normalizeCatalogPath(process.env.EXPO_PUBLIC_API_CATALOG_PATH);
