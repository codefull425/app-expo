import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HttpError } from '../api/http';
import { useCatalogShell } from '../context/CatalogShellContext';
import { colors } from '../constants/theme';
import { buildCardapioGrid, catalogScreenStyles } from './catalogContent';

export function CardapioGridScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const {
    categories,
    isPending,
    isError,
    error,
    refetch,
    setSelected,
    setEditing,
    setDeleting,
    setAddSheetOpen,
  } = useCatalogShell();

  const showFab = !isPending && !isError && categories.length > 0;
  const isEmpty =
    categories.length === 0 || categories.every((c) => c.items.length === 0);

  const safeBottom = Math.max(insets.bottom, 12);
  const scrollBottomPad = 32 + safeBottom + (showFab ? 64 : 0);

  let mainContent: React.ReactNode;

  if (isPending) {
    mainContent = (
      <View style={catalogScreenStyles.centered}>
        <ActivityIndicator size="large" color={colors.primaryGreen} />
      </View>
    );
  } else if (isError) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar';
    const requestUrl =
      error instanceof HttpError && error.requestUrl ? error.requestUrl : null;
    mainContent = (
      <View style={catalogScreenStyles.centered}>
        <Text style={catalogScreenStyles.errorText}>{message}</Text>
        {requestUrl ? (
          <Text style={catalogScreenStyles.errorUrl} selectable>
            {`Pedido: ${requestUrl}`}
          </Text>
        ) : null}
        <Pressable style={catalogScreenStyles.retryBtn} onPress={() => refetch()}>
          <Text style={catalogScreenStyles.retryText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  } else if (isEmpty) {
    mainContent = (
      <Text style={catalogScreenStyles.emptyText}>Nenhum item no cardápio.</Text>
    );
  } else {
    mainContent = buildCardapioGrid(
      categories,
      setSelected,
      (item, categoryId) => setEditing({ item, categoryId }),
      (item, categoryId) => setDeleting({ item, categoryId }),
    );
  }

  return (
    <View style={{ flex: 1, position: 'relative', backgroundColor: colors.white }}>
      <ScrollView
        style={catalogScreenStyles.scroll}
        contentContainerStyle={[
          catalogScreenStyles.scrollContent,
          { paddingBottom: scrollBottomPad },
        ]}
      >
        <Text style={catalogScreenStyles.pageTitle}>Cardápio do restaurante</Text>
        {mainContent}
      </ScrollView>
      {showFab ? (
        <Pressable
          style={[catalogScreenStyles.fab, { bottom: safeBottom + 28 }]}
          onPress={() => setAddSheetOpen(true)}
          accessibilityLabel="Adicionar item ao cardápio"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={30} color={colors.white} />
        </Pressable>
      ) : null}
    </View>
  );
}
