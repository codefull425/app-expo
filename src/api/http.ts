import { getApiBaseUrl } from './config';

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
    public readonly requestUrl?: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

const NETWORK_HINT =
  'Confirme: json-server com --host 0.0.0.0, porta 3000, PC e telemóvel na mesma Wi‑Fi, firewall a permitir a porta.';

/** Cardápio: sempre GET `/categories`. `/items` (env antigo ou cliente legado) → `/categories`. */
function catalogPathOnly(path: string): string {
  const pathOnly = path.split('?')[0] ?? path;
  const p = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  if (p === '/items' || p.startsWith('/items/')) {
    return '/categories' + p.slice('/items'.length);
  }
  return p;
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const API_BASE_URL = getApiBaseUrl();
  if (!API_BASE_URL) {
    throw new HttpError('URL da API não configurada (base vazia)', 0);
  }

  const pathOnly = catalogPathOnly(path);
  const url = `${API_BASE_URL}${pathOnly}`;
  const method = (init?.method ?? 'GET').toUpperCase();

  let res: Response;
  try {
    res = await fetch(url, {
      cache: method === 'GET' ? 'no-store' : undefined,
      ...init,
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
    });
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    throw new HttpError(
      `Falha de rede (${reason}). URL: ${url}. ${NETWORK_HINT}`,
      0,
      undefined,
      url,
    );
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new HttpError('Resposta não é JSON válido', res.status, text);
  }

  if (!res.ok) {
    let msg =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message: unknown }).message)
        : res.statusText || `HTTP ${res.status}`;
    if (res.status === 404) {
      msg += ` — confirme \`npm run api\` (cantina-expo) e GET /categories nesta URL.`;
    }
    throw new HttpError(msg, res.status, data, url);
  }

  return data as T;
}
