import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HttpError } from '../api/http';
import type { CatalogCategory, CatalogItem } from '../api/types';
import { AddItemBottomSheet } from '../components/AddItemBottomSheet';
import { AppHeader } from '../components/AppHeader';
import { CatalogListingCard } from '../components/CatalogListingCard';
import { CategoryHeading } from '../components/CategoryHeading';
import { ConfirmDeleteItemModal } from '../components/ConfirmDeleteItemModal';
import { EditItemModal } from '../components/EditItemModal';
import { ItemCard } from '../components/ItemCard';
import { MobileSidebar } from '../components/MobileSidebar';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { colors, fonts, layout, spacing } from '../constants/theme';
import { useCatalog } from '../hooks/useCatalog';

type MainView = 'cardapio' | 'saldo';

function buildCardapioGrid(
  categories: CatalogCategory[],
  onSelectItem: (item: CatalogItem) => void,
  onBeginEdit: (item: CatalogItem, categoryId: string) => void,
  onBeginDelete: (item: CatalogItem, categoryId: string) => void,
): React.ReactNode {
  return React.createElement(
    React.Fragment,
    null,
    ...categories.flatMap((cat) => {
      if (cat.items.length === 0) {
        return [];
      }
      const heading = React.createElement(CategoryHeading, {
        key: `h-${cat.id}`,
        label: cat.label,
      });
      const grid = React.createElement(
        View,
        { key: `g-${cat.id}`, style: styles.grid },
        ...cat.items.map((item) =>
          React.createElement(
            View,
            { key: item.id, style: styles.cell },
            React.createElement(ItemCard, {
              name: item.name,
              price: item.price,
              description: item.description,
              imageUrl: item.imageUrl,
              onPress: () => onSelectItem(item),
              onEditPress: () => onBeginEdit(item, cat.id),
              onTrashPress: () => onBeginDelete(item, cat.id),
            }),
          ),
        ),
      );
      return [heading, grid];
    }),
  );
}

function buildListingByCategory(
  categories: CatalogCategory[],
  onSelectItem: (item: CatalogItem) => void,
): React.ReactNode {
  return React.createElement(
    React.Fragment,
    null,
    ...categories.flatMap((cat) => {
      if (cat.items.length === 0) {
        return [];
      }
      const heading = React.createElement(CategoryHeading, {
        key: `lh-${cat.id}`,
        label: cat.label,
      });
      const list = React.createElement(
        View,
        { key: `ll-${cat.id}`, style: styles.listColumn },
        ...cat.items.map((item) =>
          React.createElement(CatalogListingCard, {
            key: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            onPress: () => onSelectItem(item),
          }),
        ),
      );
      return [heading, list];
    }),
  );
}

export function CardapioScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const { data, isPending, isError, error, refetch } = useCatalog();
  const [mainView, setMainView] = useState<MainView>('cardapio');
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [editing, setEditing] = useState<{
    item: CatalogItem;
    categoryId: string;
  } | null>(null);
  const [deleting, setDeleting] = useState<{
    item: CatalogItem;
    categoryId: string;
  } | null>(null);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = data ?? [];
  const showFab =
    mainView === 'cardapio' && !isPending && !isError && categories.length > 0;
  const isEmpty =
    categories.length === 0 || categories.every((c) => c.items.length === 0);

  let mainContent: React.ReactNode;

  if (isPending) {
    mainContent = React.createElement(
      View,
      { style: styles.centered },
      React.createElement(ActivityIndicator, {
        size: 'large',
        color: colors.primaryGreen,
      }),
    );
  } else if (isError) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar';
    const requestUrl =
      error instanceof HttpError && error.requestUrl ? error.requestUrl : null;
    mainContent = React.createElement(
      View,
      { style: styles.centered },
      React.createElement(Text, { style: styles.errorText }, message),
      requestUrl
        ? React.createElement(
            Text,
            { style: styles.errorUrl, selectable: true },
            `Pedido: ${requestUrl}`,
          )
        : null,
      React.createElement(
        Pressable,
        { style: styles.retryBtn, onPress: () => refetch() },
        React.createElement(Text, { style: styles.retryText }, 'Tentar novamente'),
      ),
    );
  } else if (isEmpty) {
    mainContent = React.createElement(
      Text,
      { style: styles.emptyText },
      mainView === 'saldo'
        ? 'Nenhum item na listagem.'
        : 'Nenhum item no cardápio.',
    );
  } else if (mainView === 'saldo') {
    mainContent = buildListingByCategory(categories, setSelected);
  } else {
    mainContent = buildCardapioGrid(
      categories,
      setSelected,
      (item, categoryId) => setEditing({ item, categoryId }),
      (item, categoryId) => setDeleting({ item, categoryId }),
    );
  }

  const safeBottom = Math.max(insets.bottom, 12);
  const scrollBottomPad = 32 + safeBottom + (showFab ? 64 : 0);

  const pageTitle = mainView === 'cardapio' ? 'Cardápio de Ana' : 'Listagem';

  return React.createElement(
    View,
    { style: styles.root },
    React.createElement(AppHeader, {
      menuExpanded: sidebarOpen,
      onMenuPress: () => setSidebarOpen((o) => !o),
    }),
    React.createElement(
      ScrollView,
      {
        style: styles.scroll,
        contentContainerStyle: [
          styles.scrollContent,
          { paddingBottom: scrollBottomPad },
        ],
      },
      React.createElement(Text, { style: styles.pageTitle }, pageTitle),
      mainContent,
    ),
    showFab
      ? React.createElement(
          Pressable,
          {
            style: [styles.fab, { bottom: safeBottom + 28 }],
            onPress: () => setAddSheetOpen(true),
            accessibilityLabel: 'Adicionar item ao cardápio',
            accessibilityRole: 'button' as const,
          },
          React.createElement(Ionicons, {
            name: 'add',
            size: 30,
            color: colors.white,
          }),
        )
      : null,
    React.createElement(MobileSidebar, {
      open: sidebarOpen,
      onClose: () => setSidebarOpen(false),
      /* Espelha front-end-cantina: `(headerClick)` / `(scheduleClick)` no `app.component.html` */
      onHeaderClick: () => setMainView('cardapio'),
      onScheduleClick: () => setMainView('saldo'),
    }),
    React.createElement(AddItemBottomSheet, {
      visible: addSheetOpen,
      categories,
      onClose: () => setAddSheetOpen(false),
    }),
    React.createElement(ProductDetailModal, {
      visible: selected != null,
      name: selected?.name ?? '',
      price: selected?.price ?? '',
      description: selected?.description ?? '',
      imageUrl: selected?.imageUrl,
      onClose: () => setSelected(null),
    }),
    React.createElement(EditItemModal, {
      visible: editing != null,
      item: editing?.item ?? null,
      categoryId: editing?.categoryId ?? null,
      onClose: () => setEditing(null),
    }),
    React.createElement(ConfirmDeleteItemModal, {
      visible: deleting != null,
      item: deleting?.item ?? null,
      categoryId: deleting?.categoryId ?? null,
      onClose: () => setDeleting(null),
      onDeleted: (itemId: string) => {
        setSelected((s) => (s?.id === itemId ? null : s));
        setEditing((e) => (e?.item.id === itemId ? null : e));
      },
    }),
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.white,
  },
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
