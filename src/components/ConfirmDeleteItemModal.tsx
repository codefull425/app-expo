import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { deleteCatalogItem } from '../api/deleteCatalogItem';
import type { CatalogItem } from '../api/types';
import { colors, fonts } from '../constants/theme';
import { catalogQueryKey } from '../hooks/useCatalog';

type Props = {
  visible: boolean;
  item: CatalogItem | null;
  categoryId: string | null;
  onClose: () => void;
  onDeleted?: (itemId: string) => void;
};

export function ConfirmDeleteItemModal({
  visible,
  item,
  categoryId,
  onClose,
  onDeleted,
}: Props): React.ReactElement {
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: deleteCatalogItem,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: catalogQueryKey });
      setApiError(null);
      onDeleted?.(variables.itemId);
      onClose();
    },
    onError: (e: Error) => {
      setApiError(e.message ?? 'Não foi possível excluir.');
    },
  });

  useEffect(() => {
    if (visible) {
      setApiError(null);
    }
  }, [visible]);

  const open = visible && item != null && categoryId != null;
  const itemName = item?.name ?? '';

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.centerWrap}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Fechar ao tocar fora"
        />
        <View style={styles.modalFrame} accessibilityLabel="Confirmar exclusão">
          <View style={styles.modalInner}>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={12}
              accessibilityLabel="Fechar"
              disabled={mutation.isPending}
            >
              <Ionicons name="close" size={22} color={colors.primaryGreen} />
            </Pressable>
            <Text style={styles.title}>Excluir item?</Text>
            <Text style={styles.message}>
              {`Deseja excluir “${itemName}”? Esta ação não pode ser desfeita.`}
            </Text>
            {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}
            <View style={styles.actionsRow}>
              <Pressable
                style={[styles.ctaOutline, mutation.isPending ? styles.ctaDisabled : null]}
                onPress={onClose}
                disabled={mutation.isPending}
                accessibilityLabel="Cancelar exclusão"
              >
                <Text style={styles.ctaOutlineText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.ctaDanger, mutation.isPending ? styles.ctaDisabled : null]}
                onPress={() => {
                  if (!item || !categoryId) {
                    return;
                  }
                  mutation.mutate({ categoryId, itemId: item.id });
                }}
                disabled={mutation.isPending}
                accessibilityLabel="Confirmar exclusão"
              >
                {mutation.isPending ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.ctaDangerText}>Excluir</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalFrame: {
    width: '100%',
    maxWidth: 293,
    borderRadius: 20,
    backgroundColor: colors.primaryGreen,
    padding: 3,
  },
  modalInner: {
    borderRadius: 17,
    backgroundColor: colors.white,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  title: {
    fontFamily: fonts.bold,
    paddingHorizontal: 36,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryGreen,
    textAlign: 'center',
  },
  message: {
    fontFamily: fonts.medium,
    width: '100%',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontFamily: fonts.medium,
    color: '#c62828',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  ctaOutline: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaOutlineText: {
    fontFamily: fonts.extrabold,
    color: colors.primaryGreen,
    fontSize: 15,
    fontWeight: '800',
  },
  ctaDanger: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#c62828',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaDangerText: {
    fontFamily: fonts.extrabold,
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  ctaDisabled: {
    opacity: 0.65,
  },
});
