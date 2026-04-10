import type { CatalogCategory, CatalogItem, CategoryDto, ItemDto } from './types';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function formatPriceFromDto(dto: ItemDto): string {
  if (dto.price != null && dto.price !== '') {
    return dto.price;
  }
  if (dto.price_cents != null && Number.isFinite(dto.price_cents)) {
    return brl.format(dto.price_cents / 100);
  }
  if (dto.price_value != null && Number.isFinite(dto.price_value)) {
    return brl.format(dto.price_value);
  }
  return brl.format(0);
}

export function mapItemDtoToCard(dto: ItemDto): CatalogItem {
  const priceCents =
    dto.price_cents != null && Number.isFinite(dto.price_cents)
      ? Math.round(dto.price_cents)
      : undefined;
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    price: formatPriceFromDto(dto),
    imageUrl: dto.image_url ?? undefined,
    priceCents,
  };
}

export function mapCategoryDto(dto: CategoryDto): CatalogCategory {
  return {
    id: dto.id,
    label: dto.name,
    items: dto.items.map(mapItemDtoToCard),
  };
}
