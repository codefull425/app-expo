import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ITEM_IMAGE_FALLBACK } from '../constants/itemImageFallback';
import { colors, fonts } from '../constants/theme';

type Props = {
  visible: boolean;
  name: string;
  price: string;
  description: string;
  imageUrl?: string;
  onClose: () => void;
};

export function ProductDetailModal({
  visible,
  name,
  price,
  description,
  imageUrl,
  onClose,
}: Props): React.ReactElement {
  const trimmed = imageUrl?.trim() ?? '';
  const [remoteFailed, setRemoteFailed] = useState(false);
  useEffect(() => {
    setRemoteFailed(false);
  }, [trimmed]);
  const useRemote = trimmed.length > 0 && !remoteFailed;
  const source = useRemote ? { uri: trimmed } : ITEM_IMAGE_FALLBACK;

  return React.createElement(
    Modal,
    {
      visible,
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
        {
          style: styles.modalFrame,
          accessibilityLabel: name,
        },
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
          React.createElement(Text, { style: styles.title }, name),
          React.createElement(
            View,
            { style: styles.photoWrap },
            React.createElement(Image, {
              source,
              style: styles.photo,
              contentFit: 'contain' as const,
              onError: () => setRemoteFailed(true),
            }),
          ),
          React.createElement(Text, { style: styles.desc }, description),
          React.createElement(Text, { style: styles.price }, price),
          React.createElement(
            Pressable,
            { style: styles.cta, onPress: onClose },
            React.createElement(Text, { style: styles.ctaText }, 'Fechar'),
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
  /** Anel verde de 3px: borda inferior não some com borderRadius no RN. */
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
    width: '100%',
    paddingHorizontal: 36,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryGreen,
    textAlign: 'center' as const,
  },
  photoWrap: {
    width: 150,
    height: 100,
    alignSelf: 'center',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 150,
    height: 100,
  },
  desc: {
    fontFamily: fonts.medium,
    width: '100%',
    marginBottom: 12,
    fontSize: 12,
    fontWeight: '500',
    color: colors.darkGray,
    textAlign: 'center' as const,
    lineHeight: 16,
  },
  price: {
    fontFamily: fonts.semibold,
    marginBottom: 16,
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryGreen,
    textAlign: 'center',
  },
  cta: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: fonts.extrabold,
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
