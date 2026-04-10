import type { CatalogItem } from '../api/types';

export function parsePriceToCents(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (t === '') {
    return null;
  }
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) {
    return null;
  }
  return Math.round(n * 100);
}

export function centsToPriceInput(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',');
}

export function catalogItemInitialPriceText(item: CatalogItem): string {
  if (item.priceCents != null && Number.isFinite(item.priceCents)) {
    return centsToPriceInput(item.priceCents);
  }
  return item.price.replace(/R\$\s*/i, '').trim();
}
