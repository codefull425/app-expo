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

import { addCatalogItem } from '../api/addCatalogItem';
import type { CatalogCategory } from '../api/types';
import { colors, fonts } from '../constants/theme';
import { catalogQueryKey } from '../hooks/useCatalog';
import { parsePriceToCents } from '../utils/catalogPriceInput';

type Props = {
  visible: boolean;
  categories: CatalogCategory[];
  onClose: () => void;
};

export function AddItemBottomSheet({
  visible,
  categories,
  onClose,
}: Props): React.ReactElement {
  const queryClient = useQueryClient();
  const [categoryId, setCategoryId] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceText, setPriceText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && categories.length > 0) {
      setCategoryId((prev) => (prev && categories.some((c) => c.id === prev) ? prev : categories[0].id));
    }
  }, [visible, categories]);

  const mutation = useMutation({
    mutationFn: addCatalogItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: catalogQueryKey });
      setName('');
      setDescription('');
      setPriceText('');
      setImageUrl('');
      setNameError(null);
      setPriceError(null);
      setCategoryError(null);
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
    setNameError(null);
    setPriceError(null);
    setCategoryError(null);
    setApiError(null);
    mutation.reset();

    const n = name.trim();
    const rawPrice = priceText.trim();
    let hasBlocking = false;
    if (!categoryId && categories.length > 0) {
      setCategoryError('Escolha uma categoria.');
      hasBlocking = true;
    }
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
      name: n,
      description: description.trim() || undefined,
      priceCents: cents,
      imageUrl: imageUrl.trim() || undefined,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.centerWrap}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Fechar ao tocar fora"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrap}
        >
          <View style={styles.modalFrame} accessibilityLabel="Novo item">
            <View style={styles.modalInner}>
              <Pressable
                onPress={onClose}
                style={styles.closeBtn}
                hitSlop={12}
                accessibilityLabel="Fechar"
              >
                <Ionicons name="close" size={22} color={colors.primaryGreen} />
              </Pressable>
              <Text style={styles.title}>Novo item</Text>
              <ScrollView
                style={styles.formScroll}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.formContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.label}>Categoria</Text>
                <View style={styles.chipsRow}>
                  {categories.map((c) => (
                    <Pressable
                      key={c.id}
                      onPress={() => {
                        setCategoryId(c.id);
                        setCategoryError(null);
                      }}
                      style={[styles.chip, categoryId === c.id ? styles.chipActive : null]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          categoryId === c.id ? styles.chipTextActive : null,
                        ]}
                      >
                        {c.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {categoryError ? <Text style={styles.fieldError}>{categoryError}</Text> : null}
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={(t: string) => {
                    setName(t);
                    setNameError(null);
                  }}
                  placeholder="Ex.: Marguerita"
                  placeholderTextColor={colors.darkGray}
                />
                {nameError ? <Text style={styles.fieldError}>{nameError}</Text> : null}
                <Text style={styles.label}>Descrição (opcional)</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Ingredientes ou detalhes"
                  placeholderTextColor={colors.darkGray}
                  multiline
                  textAlignVertical="top"
                />
                <Text style={styles.label}>Preço (R$)</Text>
                <TextInput
                  style={styles.input}
                  value={priceText}
                  onChangeText={(t: string) => {
                    setPriceText(t);
                    setPriceError(null);
                  }}
                  placeholder="Ex.: 42,00"
                  placeholderTextColor={colors.darkGray}
                  keyboardType="decimal-pad"
                />
                {priceError ? <Text style={styles.fieldError}>{priceError}</Text> : null}
                <Text style={styles.label}>URL da imagem (opcional)</Text>
                <TextInput
                  style={styles.input}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  placeholder="https://…"
                  placeholderTextColor={colors.darkGray}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}
              </ScrollView>
              <Pressable
                style={[styles.cta, mutation.isPending ? styles.ctaDisabled : null]}
                onPress={handleSubmit}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.ctaText}>Cadastrar item</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.primaryGreen,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primaryGreen,
  },
  chipTextActive: {
    color: colors.white,
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
