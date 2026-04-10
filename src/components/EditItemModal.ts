import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { updateCatalogItem } from '../api/updateCatalogItem';
import type { CatalogItem } from '../api/types';
import { colors, fonts } from '../constants/theme';
import { catalogQueryKey } from '../hooks/useCatalog';
import { catalogItemInitialPriceText, parsePriceToCents } from '../utils/catalogPriceInput';

type Props = {
  visible: boolean;
  item: CatalogItem | null;
  categoryId: string | null;
  onClose: () => void;
};

/** Modal de edição no mesmo chrome de {@link ProductDetailModal} / {@link AddItemBottomSheet}. */
export function EditItemModal({
  visible,
  item,
  categoryId,
  onClose,
}: Props): React.ReactElement {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceText, setPriceText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && item) {
      setName(item.name);
      setDescription(item.description);
      setPriceText(catalogItemInitialPriceText(item));
      setImageUrl(item.imageUrl?.trim() ?? '');
      setNameError(null);
      setPriceError(null);
      setApiError(null);
    }
  }, [visible, item]);

  const mutation = useMutation({
    mutationFn: updateCatalogItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: catalogQueryKey });
      setApiError(null);
      onClose();
    },
    onError: (e: Error) => {
      setApiError(e.message ?? 'Não foi possível salvar.');
    },
  });

  useEffect(() => {
    if (visible) {
      setApiError(null);
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!item || !categoryId) {
      return;
    }
    setNameError(null);
    setPriceError(null);
    setApiError(null);
    mutation.reset();

    const n = name.trim();
    const rawPrice = priceText.trim();
    let hasBlocking = false;
    if (!n) {
      setNameError('Informe o nome do item.');
      hasBlocking = true;
    }
    if (rawPrice === '') {
      setPriceError('Informe o preço.');
      hasBlocking = true;
    } else {
      const parsed = parsePriceToCents(priceText);
      if (parsed == null) {
        setPriceError('Preço inválido. Use ex.: 12,90 ou 10.');
        hasBlocking = true;
      }
    }
    if (hasBlocking) {
      return;
    }
    const cents = parsePriceToCents(priceText)!;
    mutation.mutate({
      categoryId,
      itemId: item.id,
      name: n,
      description: description.trim() || undefined,
      priceCents: cents,
      imageUrl: imageUrl.trim() || undefined,
    });
  };

  return React.createElement(
    Modal,
    {
      visible: visible && item != null && categoryId != null,
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
        KeyboardAvoidingView,
        {
          behavior: Platform.OS === 'ios' ? 'padding' : undefined,
          style: styles.keyboardWrap,
        },
        React.createElement(
          View,
          { style: styles.modalFrame, accessibilityLabel: 'Editar item' },
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
              },
              React.createElement(Ionicons, {
                name: 'close',
                size: 22,
                color: colors.primaryGreen,
              }),
            ),
            React.createElement(Text, { style: styles.title }, 'Editar item'),
            React.createElement(
              ScrollView,
              {
                style: styles.formScroll,
                keyboardShouldPersistTaps: 'handled' as const,
                contentContainerStyle: styles.formContent,
                showsVerticalScrollIndicator: false,
              },
              React.createElement(Text, { style: styles.label }, 'Nome'),
              React.createElement(TextInput, {
                style: styles.input,
                value: name,
                onChangeText: (t: string) => {
                  setName(t);
                  setNameError(null);
                },
                placeholder: 'Nome do item',
                placeholderTextColor: colors.darkGray,
              }),
              nameError ? React.createElement(Text, { style: styles.fieldError }, nameError) : null,
              React.createElement(Text, { style: styles.label }, 'Descrição (opcional)'),
              React.createElement(TextInput, {
                style: [styles.input, styles.inputMultiline],
                value: description,
                onChangeText: setDescription,
                placeholder: 'Ingredientes ou detalhes',
                placeholderTextColor: colors.darkGray,
                multiline: true,
                textAlignVertical: 'top' as const,
              }),
              React.createElement(Text, { style: styles.label }, 'Preço (R$)'),
              React.createElement(TextInput, {
                style: styles.input,
                value: priceText,
                onChangeText: (t: string) => {
                  setPriceText(t);
                  setPriceError(null);
                },
                placeholder: 'Ex.: 42,00',
                placeholderTextColor: colors.darkGray,
                keyboardType: 'decimal-pad' as const,
              }),
              priceError ? React.createElement(Text, { style: styles.fieldError }, priceError) : null,
              React.createElement(Text, { style: styles.label }, 'URL da imagem (opcional)'),
              React.createElement(TextInput, {
                style: styles.input,
                value: imageUrl,
                onChangeText: setImageUrl,
                placeholder: 'https://…',
                placeholderTextColor: colors.darkGray,
                autoCapitalize: 'none' as const,
                autoCorrect: false,
              }),
              apiError ? React.createElement(Text, { style: styles.errorText }, apiError) : null,
            ),
            React.createElement(
              Pressable,
              {
                style: [styles.cta, mutation.isPending ? styles.ctaDisabled : null],
                onPress: handleSubmit,
                disabled: mutation.isPending,
              },
              mutation.isPending
                ? React.createElement(ActivityIndicator, { color: colors.white })
                : React.createElement(Text, { style: styles.ctaText }, 'Finalizar edição'),
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
  keyboardWrap: {
    width: '100%',
    maxWidth: 293,
    alignItems: 'stretch',
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
    marginRight: 32,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryGreen,
    textAlign: 'center',
  },
  formScroll: {
    maxHeight: 340,
  },
  formContent: {
    paddingBottom: 8,
    gap: 6,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    fontWeight: '600',
    color: colors.darkGray,
    marginTop: 4,
  },
  input: {
    fontFamily: fonts.regular,
    borderWidth: 1,
    borderColor: colors.darkGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.outlineBlack,
  },
  inputMultiline: {
    minHeight: 64,
    paddingTop: 8,
  },
  fieldError: {
    fontFamily: fonts.medium,
    color: '#c62828',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 2,
    lineHeight: 16,
  },
  errorText: {
    fontFamily: fonts.medium,
    color: '#c62828',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    lineHeight: 16,
  },
  cta: {
    width: '100%',
    height: 40,
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    fontFamily: fonts.extrabold,
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
