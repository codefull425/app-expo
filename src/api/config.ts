/**
 * Origem do cardápio: json-server em `GET {base}/categories` (path em `fetchCatalog`; `/items` é coagido em `http.ts`).
 * Em telemóvel + Expo Go, a base usa o IP do PC (via `debuggerHost`), não `localhost`.
 * Substitua por `EXPO_PUBLIC_API_BASE_URL` se precisar (tunnel, outro host).
 *
 * Na pasta cantina-expo: `npm run api` (api-server.js). Catálogo: `GET …/categories`.
 */
import { normalizeCatalogPath, resolveApiBaseUrl } from './resolveApiBaseUrl';

export {
  JSON_SERVER_DEFAULT_BASE_URL,
  JSON_SERVER_DEFAULT_CATALOG_PATH,
} from './resolveApiBaseUrl';

/** Resolve de novo em cada pedido — no arranque o `debuggerHost` do Expo pode ainda não estar disponível. */
export function getApiBaseUrl(): string {
  return resolveApiBaseUrl();
}

export const CATALOG_PATH = normalizeCatalogPath(process.env.EXPO_PUBLIC_API_CATALOG_PATH);
