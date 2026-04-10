import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AddItemBottomSheet } from '../components/AddItemBottomSheet';
import { AppHeader } from '../components/AppHeader';
import { ConfirmDeleteItemModal } from '../components/ConfirmDeleteItemModal';
import { EditItemModal } from '../components/EditItemModal';
import { MobileSidebar } from '../components/MobileSidebar';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CatalogShellProvider, useCatalogShell } from '../context/CatalogShellContext';
import { CardapioGridScreen } from '../screens/CardapioGridScreen';
import { ListagemScreen } from '../screens/ListagemScreen';
import { navigationRef } from './navigationRef';
import type { CantinaStackParamList } from './types';

const Stack = createNativeStackNavigator<CantinaStackParamList>();

function CantinaLayoutInner(): React.ReactElement {
  const {
    sidebarOpen,
    setSidebarOpen,
    categories,
    selected,
    setSelected,
    editing,
    setEditing,
    deleting,
    setDeleting,
    addSheetOpen,
    setAddSheetOpen,
  } = useCatalogShell();

  return (
    <View style={styles.root}>
      <AppHeader
        menuExpanded={sidebarOpen}
        onMenuPress={() => setSidebarOpen((o) => !o)}
      />
      <Stack.Navigator
        initialRouteName="Cardapio"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Cardapio" component={CardapioGridScreen} />
        <Stack.Screen name="Listagem" component={ListagemScreen} />
      </Stack.Navigator>
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onHeaderClick={() => {
          navigationRef.navigate('Cardapio');
          setSidebarOpen(false);
        }}
        onScheduleClick={() => {
          navigationRef.navigate('Listagem');
          setSidebarOpen(false);
        }}
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

export function CantinaLayout(): React.ReactElement {
  return (
    <CatalogShellProvider>
      <CantinaLayoutInner />
    </CatalogShellProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#ffffff',
  },
});
