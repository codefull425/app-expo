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

const EDIT_ICON_SIZE = 20;

const WEB_POINTER =
  Platform.OS === 'web' ? ({ cursor: 'pointer' } as const) : ({} as const);

function webImagePassThroughStyle(): { pointerEvents: 'none' } | undefined {
  return Platform.OS === 'web' ? { pointerEvents: 'none' } : undefined;
}

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
  onEditPress?: () => void;
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

  const trashImageEl = (
    <Image
      source={LIXEIRA_PNG}
      style={[styles.trashIconImage, webImagePassThroughStyle() as never]}
      contentFit="contain"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );

  let trashNode: React.ReactNode;
  if (Platform.OS === 'web' && onTrashPress) {
    trashNode = (
      <button
        type="button"
        title="excluir"
        aria-label="excluir"
        style={{
          ...WEB_ICON_BUTTON_RESET,
          ...flattenWebStyle([styles.trashHit, WEB_POINTER, styles.iconLayer]),
        }}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onTrashPress();
        }}
      >
        {trashImageEl}
      </button>
    );
  } else if (Platform.OS === 'web') {
    trashNode = (
      <div
        title="excluir"
        role="img"
        aria-label="excluir"
        style={flattenWebStyle([styles.trashHit, WEB_POINTER, styles.iconLayer])}
      >
        {trashImageEl}
      </div>
    );
  } else if (onTrashPress) {
    trashNode = (
      <Pressable
        style={[styles.trashHit, WEB_POINTER, styles.iconLayer]}
        onPress={(e: { stopPropagation?: () => void }) => {
          e?.stopPropagation?.();
          onTrashPress();
        }}
        hitSlop={12}
        accessibilityLabel="excluir"
        accessibilityRole="button"
      >
        {trashImageEl}
      </Pressable>
    );
  } else {
    trashNode = (
      <View
        style={[styles.trashHit, WEB_POINTER, styles.iconLayer]}
        accessibilityLabel="excluir"
        accessibilityRole="image"
      >
        {trashImageEl}
      </View>
    );
  }

  const editImage = (
    <Image
      source={EDITAR_PNG}
      style={[styles.editIcon, webImagePassThroughStyle() as never]}
      contentFit="contain"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );

  let editNode: React.ReactNode;
  if (Platform.OS === 'web' && onEditPress) {
    editNode = (
      <button
        type="button"
        title="editar"
        aria-label="editar"
        style={{
          ...WEB_ICON_BUTTON_RESET,
          ...flattenWebStyle([styles.editHit, WEB_POINTER, styles.iconLayer]),
        }}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onEditPress();
        }}
      >
        {editImage}
      </button>
    );
  } else if (Platform.OS === 'web') {
    editNode = (
      <div
        title="editar"
        role="img"
        aria-label="editar"
        style={flattenWebStyle([styles.editHit, WEB_POINTER, styles.iconLayer])}
      >
        {editImage}
      </div>
    );
  } else if (onEditPress) {
    editNode = (
      <Pressable
        style={[styles.editHit, WEB_POINTER, styles.iconLayer]}
        onPress={(e: { stopPropagation?: () => void }) => {
          e?.stopPropagation?.();
          onEditPress();
        }}
        hitSlop={12}
        accessibilityLabel="editar"
        accessibilityRole="button"
      >
        {editImage}
      </Pressable>
    );
  } else {
    editNode = (
      <View
        style={[styles.editHit, WEB_POINTER, styles.iconLayer]}
        pointerEvents="box-none"
        accessibilityLabel="editar"
        accessibilityRole="image"
      >
        {editImage}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${price}`}
    >
      <View style={styles.body}>
        <Image
          source={source}
          style={styles.image}
          contentFit="contain"
          onError={() => setRemoteFailed(true)}
        />
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.desc} numberOfLines={3}>
          {description}
        </Text>
        <Text style={styles.price}>{price}</Text>
        {trashNode}
        {editNode}
      </View>
    </Pressable>
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
