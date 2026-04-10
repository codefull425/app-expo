import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  return (
    <>
      {categories.flatMap((cat) => {
        if (cat.items.length === 0) {
          return [];
        }
        return [
          <CategoryHeading key={`h-${cat.id}`} label={cat.label} />,
          <View key={`g-${cat.id}`} style={styles.grid}>
            {cat.items.map((item) => (
              <View key={item.id} style={styles.cell}>
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

function buildListingByCategory(
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
          <View key={`ll-${cat.id}`} style={styles.listColumn}>
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
    mainContent = (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primaryGreen} />
      </View>
    );
  } else if (isError) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar';
    const requestUrl =
      error instanceof HttpError && error.requestUrl ? error.requestUrl : null;
    mainContent = (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{message}</Text>
        {requestUrl ? (
          <Text style={styles.errorUrl} selectable>
            {`Pedido: ${requestUrl}`}
          </Text>
        ) : null}
        <Pressable style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  } else if (isEmpty) {
    mainContent = (
      <Text style={styles.emptyText}>
        {mainView === 'saldo' ? 'Nenhum item na listagem.' : 'Nenhum item no cardápio.'}
      </Text>
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

  const pageTitle = mainView === 'cardapio' ? 'Cardápio do restaurante' : 'Listagem';

  return (
    <View style={styles.root}>
      <AppHeader
        menuExpanded={sidebarOpen}
        onMenuPress={() => setSidebarOpen((o) => !o)}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPad }]}
      >
        <Text style={styles.pageTitle}>{pageTitle}</Text>
        {mainContent}
      </ScrollView>
      {showFab ? (
        <Pressable
          style={[styles.fab, { bottom: safeBottom + 28 }]}
          onPress={() => setAddSheetOpen(true)}
          accessibilityLabel="Adicionar item ao cardápio"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={30} color={colors.white} />
        </Pressable>
      ) : null}
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onHeaderClick={() => setMainView('cardapio')}
        onScheduleClick={() => setMainView('saldo')}
      />
      <AddItemBottomSheet
        visible={addSheetOpen}
        categories={categories}
        onClose={() => setAddSheetOpen(false)}
      />
      <ProductDetailModal
        visible={selected != null}
        name={selected?.name ?? ''}
        price={selected?.price ?? ''}
        description={selected?.description ?? ''}
        imageUrl={selected?.imageUrl}
        onClose={() => setSelected(null)}
      />
      <EditItemModal
        visible={editing != null}
        item={editing?.item ?? null}
        categoryId={editing?.categoryId ?? null}
        onClose={() => setEditing(null)}
      />
      <ConfirmDeleteItemModal
        visible={deleting != null}
        item={deleting?.item ?? null}
        categoryId={deleting?.categoryId ?? null}
        onClose={() => setDeleting(null)}
        onDeleted={(itemId: string) => {
          setSelected((s) => (s?.id === itemId ? null : s));
          setEditing((e) => (e?.item.id === itemId ? null : e));
        }}
      />
    </View>
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
