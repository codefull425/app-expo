import { Image } from 'expo-image';
import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { ITEM_IMAGE_FALLBACK } from '../constants/itemImageFallback';
import { colors, fonts, layout } from '../constants/theme';

const LIXEIRA_PNG = require('../../assets/Lixeira.png');
const EDITAR_PNG = require('../../assets/Editar.png');

/** Largura/altura do ícone Editar (24px da lixeira − 4px por lado). */
const EDIT_ICON_SIZE = 20;

const WEB_POINTER =
  Platform.OS === 'web' ? ({ cursor: 'pointer' } as const) : ({} as const);

/** No web, o `img` fica por cima do wrapper — o hover/tooltip ficam no `div`/`button`. */
function webImagePassThroughStyle(): { pointerEvents: 'none' } | undefined {
  return Platform.OS === 'web' ? { pointerEvents: 'none' } : undefined;
}

/** react-native-web não repassa `title` no View — precisamos de nós DOM reais. */
function flattenWebStyle(style: StyleProp<ViewStyle>): CSSProperties {
  return StyleSheet.flatten(style) as CSSProperties;
}

const WEB_ICON_BUTTON_RESET: CSSProperties = {
  padding: 0,
  margin: 0,
  borderStyle: 'none',
  backgroundColor: 'transparent',
  display: 'block',
  lineHeight: 0,
};

type Props = {
  name: string;
  price: string;
  description: string;
  imageUrl?: string;
  onPress: () => void;
  /** Ação do ícone editar (canto inferior esquerdo). */
  onEditPress?: () => void;
  /** Ação do ícone lixeira (canto inferior direito). */
  onTrashPress?: () => void;
};

export function ItemCard({
  name,
  price,
  description,
  imageUrl,
  onPress,
  onEditPress,
  onTrashPress,
}: Props): React.ReactElement {
  const trimmed = imageUrl?.trim() ?? '';
  const [remoteFailed, setRemoteFailed] = useState(false);
  useEffect(() => {
    setRemoteFailed(false);
  }, [trimmed]);
  const useRemote = trimmed.length > 0 && !remoteFailed;
  const source = useRemote ? { uri: trimmed } : ITEM_IMAGE_FALLBACK;

  const bodyChildren: React.ReactNode[] = [
    React.createElement(Image, {
      key: 'img',
      source,
      style: styles.image,
      contentFit: 'contain' as const,
      onError: () => setRemoteFailed(true),
    }),
    React.createElement(
      Text,
      { key: 'name', style: styles.name, numberOfLines: 2 },
      name,
    ),
    React.createElement(
      Text,
      { key: 'desc', style: styles.desc, numberOfLines: 3 },
      description,
    ),
    React.createElement(Text, { key: 'price', style: styles.price }, price),
  ];

  const trashImageEl = React.createElement(Image, {
    source: LIXEIRA_PNG,
    style: [styles.trashIconImage, webImagePassThroughStyle() as never],
    contentFit: 'contain' as const,
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
  });

  if (Platform.OS === 'web' && onTrashPress) {
    bodyChildren.push(
      React.createElement(
        'button',
        {
          key: 'lixeira',
          type: 'button',
          title: 'excluir',
          'aria-label': 'excluir',
          style: {
            ...WEB_ICON_BUTTON_RESET,
            ...flattenWebStyle([styles.trashHit, WEB_POINTER, styles.iconLayer]),
          },
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onTrashPress();
          },
        },
        trashImageEl,
      ),
    );
  } else if (Platform.OS === 'web') {
    bodyChildren.push(
      React.createElement(
        'div',
        {
          key: 'lixeira',
          title: 'excluir',
          role: 'img',
          'aria-label': 'excluir',
          style: flattenWebStyle([styles.trashHit, WEB_POINTER, styles.iconLayer]),
        },
        trashImageEl,
      ),
    );
  } else if (onTrashPress) {
    bodyChildren.push(
      React.createElement(
        Pressable,
        {
          key: 'lixeira',
          style: [styles.trashHit, WEB_POINTER, styles.iconLayer],
          onPress: (e: { stopPropagation?: () => void }) => {
            e?.stopPropagation?.();
            onTrashPress();
          },
          hitSlop: 12,
          accessibilityLabel: 'excluir',
          accessibilityRole: 'button',
        },
        trashImageEl,
      ),
    );
  } else {
    bodyChildren.push(
      React.createElement(
        View,
        {
          key: 'lixeira',
          style: [styles.trashHit, WEB_POINTER, styles.iconLayer],
          accessibilityLabel: 'excluir',
          accessibilityRole: 'image',
        },
        trashImageEl,
      ),
    );
  }

  const editImage = React.createElement(Image, {
    source: EDITAR_PNG,
    style: [styles.editIcon, webImagePassThroughStyle() as never],
    contentFit: 'contain' as const,
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
  });

  if (Platform.OS === 'web' && onEditPress) {
    bodyChildren.push(
      React.createElement(
        'button',
        {
          key: 'editar',
          type: 'button',
          title: 'editar',
          'aria-label': 'editar',
          style: {
            ...WEB_ICON_BUTTON_RESET,
            ...flattenWebStyle([styles.editHit, WEB_POINTER, styles.iconLayer]),
          },
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onEditPress();
          },
        },
        editImage,
      ),
    );
  } else if (Platform.OS === 'web') {
    bodyChildren.push(
      React.createElement(
        'div',
        {
          key: 'editar',
          title: 'editar',
          role: 'img',
          'aria-label': 'editar',
          style: flattenWebStyle([styles.editHit, WEB_POINTER, styles.iconLayer]),
        },
        editImage,
      ),
    );
  } else if (onEditPress) {
    bodyChildren.push(
      React.createElement(
        Pressable,
        {
          key: 'editar',
          style: [styles.editHit, WEB_POINTER, styles.iconLayer],
          onPress: (e: { stopPropagation?: () => void }) => {
            e?.stopPropagation?.();
            onEditPress();
          },
          hitSlop: 12,
          accessibilityLabel: 'editar',
          accessibilityRole: 'button',
        },
        editImage,
      ),
    );
  } else {
    bodyChildren.push(
      React.createElement(
        View,
        {
          key: 'editar',
          style: [styles.editHit, WEB_POINTER, styles.iconLayer],
          pointerEvents: 'box-none',
          accessibilityLabel: 'editar',
          accessibilityRole: 'image',
        },
        editImage,
      ),
    );
  }

  return React.createElement(
    Pressable,
    {
      onPress,
      style: ({ pressed }: { pressed: boolean }) => [styles.card, pressed && styles.cardPressed],
      accessibilityRole: 'button',
      accessibilityLabel: `${name}, ${price}`,
    },
    React.createElement(View, { style: styles.body }, ...bodyChildren),
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: layout.itemCardMaxWidth,
    borderRadius: 5,
    backgroundColor: colors.lightGray,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardPressed: {
    opacity: 0.92,
  },
  body: {
    position: 'relative',
    paddingTop: 22,
    paddingHorizontal: 8,
    paddingBottom: 44,
    minHeight: 176,
    alignItems: 'center',
  },
  image: {
    width: 57,
    height: 58,
    marginBottom: 4,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryGreen,
    textAlign: 'center',
  },
  desc: {
    fontFamily: fonts.semibold,
    marginTop: 4,
    fontSize: 9,
    fontWeight: '600',
    color: colors.darkGray,
    lineHeight: 12,
    textAlign: 'center',
  },
  price: {
    fontFamily: fonts.semibold,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryGreen,
  },
  /** Garante que os ícones ficam por cima do conteúdo e recebem o hover no web. */
  iconLayer: {
    zIndex: 2,
  },
  trashHit: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 24,
    height: 24,
  },
  trashIconImage: {
    width: 24,
    height: 24,
  },
  editHit: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: EDIT_ICON_SIZE,
    height: EDIT_ICON_SIZE,
  },
  editIcon: {
    width: EDIT_ICON_SIZE,
    height: EDIT_ICON_SIZE,
  },
});
