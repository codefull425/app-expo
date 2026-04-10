import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HttpError } from '../api/http';
import { useCatalogShell } from '../context/CatalogShellContext';
import { colors } from '../constants/theme';
import { buildListingByCategory, catalogScreenStyles } from './catalogContent';

export function ListagemScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const { categories, isPending, isError, error, refetch, setSelected } = useCatalogShell();

  const isEmpty =
    categories.length === 0 || categories.every((c) => c.items.length === 0);

  const safeBottom = Math.max(insets.bottom, 12);
  const scrollBottomPad = 32 + safeBottom;

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
      <Text style={catalogScreenStyles.emptyText}>Nenhum item na listagem.</Text>
    );
  } else {
    mainContent = buildListingByCategory(categories, setSelected);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        style={catalogScreenStyles.scroll}
        contentContainerStyle={[
          catalogScreenStyles.scrollContent,
          { paddingBottom: scrollBottomPad },
        ]}
      >
        <Text style={catalogScreenStyles.pageTitle}>Listagem</Text>
        {mainContent}
      </ScrollView>
    </View>
  );
}
