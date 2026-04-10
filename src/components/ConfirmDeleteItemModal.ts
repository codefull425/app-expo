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
  /** Chamado após exclusão bem-sucedida (ex.: fechar detalhe do mesmo item). */
  onDeleted?: (itemId: string) => void;
};

/** Confirmação de exclusão no mesmo chrome de {@link ProductDetailModal}. */
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

  return React.createElement(
    Modal,
    {
      visible: open,
      transparent: true,
      animationType: 'fade' as const,
      onRequestClose: onClose,
    },
    React.createElement(
      View,
      { style: styles.centerWrap },
      React.createElement(Pressable, {
        style: StyleSheet.absoluteFill,
        onPress: onClose,
        accessibilityLabel: 'Fechar ao tocar fora',
      }),
      React.createElement(
        View,
        { style: styles.modalFrame, accessibilityLabel: 'Confirmar exclusão' },
        React.createElement(
          View,
          { style: styles.modalInner },
          React.createElement(
            Pressable,
            {
              onPress: onClose,
              style: styles.closeBtn,
              hitSlop: 12,
              accessibilityLabel: 'Fechar',
              disabled: mutation.isPending,
            },
            React.createElement(Ionicons, {
              name: 'close',
              size: 22,
              color: colors.primaryGreen,
            }),
          ),
          React.createElement(Text, { style: styles.title }, 'Excluir item?'),
          React.createElement(
            Text,
            { style: styles.message },
            `Deseja excluir “${itemName}”? Esta ação não pode ser desfeita.`,
          ),
          apiError ? React.createElement(Text, { style: styles.errorText }, apiError) : null,
          React.createElement(
            View,
            { style: styles.actionsRow },
            React.createElement(
              Pressable,
              {
                style: [styles.ctaOutline, mutation.isPending ? styles.ctaDisabled : null],
                onPress: onClose,
                disabled: mutation.isPending,
                accessibilityLabel: 'Cancelar exclusão',
              },
              React.createElement(Text, { style: styles.ctaOutlineText }, 'Cancelar'),
            ),
            React.createElement(
              Pressable,
              {
                style: [styles.ctaDanger, mutation.isPending ? styles.ctaDisabled : null],
                onPress: () => {
                  if (!item || !categoryId) {
                    return;
                  }
                  mutation.mutate({ categoryId, itemId: item.id });
                },
                disabled: mutation.isPending,
                accessibilityLabel: 'Confirmar exclusão',
              },
              mutation.isPending
                ? React.createElement(ActivityIndicator, { color: colors.white })
                : React.createElement(Text, { style: styles.ctaDangerText }, 'Excluir'),
            ),
          ),
        ),
      ),
    ),
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
    overflow: 'hidden' as const,
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
    textAlign: 'center' as const,
  },
  message: {
    fontFamily: fonts.medium,
    width: '100%',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
    textAlign: 'center' as const,
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
