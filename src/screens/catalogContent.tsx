import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { CatalogCategory, CatalogItem } from '../api/types';
import { CatalogListingCard } from '../components/CatalogListingCard';
import { CategoryHeading } from '../components/CategoryHeading';
import { ItemCard } from '../components/ItemCard';
import { colors, fonts, layout, spacing } from '../constants/theme';

export function buildCardapioGrid(
  categories: CatalogCategory[],
  onSelectItem: (item: CatalogItem) => void,
  onBeginEdit: (item: CatalogItem, categoryId: string) => void,
  onBeginDelete: (item: CatalogItem, categoryId: string) => void,
): React.ReactNode {
  return (
    <>
      {categories.flatMap((cat) => {
        if (cat.items.length === 0) {
          return [];
        }
        return [
          <CategoryHeading key={`h-${cat.id}`} label={cat.label} />,
          <View key={`g-${cat.id}`} style={catalogScreenStyles.grid}>
            {cat.items.map((item) => (
              <View key={item.id} style={catalogScreenStyles.cell}>
                <ItemCard
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  onPress={() => onSelectItem(item)}
                  onEditPress={() => onBeginEdit(item, cat.id)}
                  onTrashPress={() => onBeginDelete(item, cat.id)}
                />
              </View>
            ))}
          </View>,
        ];
      })}
    </>
  );
}

export function buildListingByCategory(
  categories: CatalogCategory[],
  onSelectItem: (item: CatalogItem) => void,
): React.ReactNode {
  return (
    <>
      {categories.flatMap((cat) => {
        if (cat.items.length === 0) {
          return [];
        }
        return [
          <CategoryHeading key={`lh-${cat.id}`} label={cat.label} />,
          <View key={`ll-${cat.id}`} style={catalogScreenStyles.listColumn}>
            {cat.items.map((item) => (
              <CatalogListingCard
                key={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                onPress={() => onSelectItem(item)}
              />
            ))}
          </View>,
        ];
      })}
    </>
  );
}

export const catalogScreenStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.screenPadding,
    alignItems: 'center',
    gap: 16,
  },
  listColumn: {
    width: '100%',
    maxWidth: layout.catalogMaxWidth,
    alignSelf: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 4,
  },
  pageTitle: {
    fontFamily: fonts.bold,
    width: '100%',
    maxWidth: layout.catalogMaxWidth,
    fontSize: 22,
    fontWeight: '700',
    color: colors.primaryGreen,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: layout.catalogMaxWidth,
    alignSelf: 'center',
    columnGap: spacing.gridGap,
    rowGap: spacing.gridRowGap,
    justifyContent: 'space-between',
  },
  cell: {
    width: '47%',
    alignItems: 'center',
  },
  centered: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontFamily: fonts.regular,
    color: colors.darkGray,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  errorUrl: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.darkGray,
    textAlign: 'center',
    paddingHorizontal: 16,
    opacity: 0.85,
  },
  retryBtn: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    fontFamily: fonts.semibold,
    color: colors.white,
    fontWeight: '600',
  },
  emptyText: {
    fontFamily: fonts.regular,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: 24,
  },
});
