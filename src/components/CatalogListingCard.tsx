import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, layout } from '../constants/theme';

export type CatalogListingCardProps = {
  name: string;
  price: string;
  description: string;
  onPress: () => void;
};

export function CatalogListingCard({
  name,
  price,
  description,
  onPress,
}: CatalogListingCardProps): React.ReactElement {
  const caption = description.trim();

  return (
    <Pressable
      onPress={onPress}
      style={styles.pressable}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${price}`}
    >
      <View style={styles.inner}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.price}>{price}</Text>
        </View>
        {caption.length > 0 ? (
          <Text style={styles.caption} numberOfLines={2}>
            {caption}
          </Text>
        ) : null}
        <View style={styles.divider} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    maxWidth: layout.catalogMaxWidth,
    alignSelf: 'center',
  },
  inner: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    fontWeight: '500',
    color: colors.outlineBlack,
  },
  price: {
    fontFamily: fonts.medium,
    fontSize: 14,
    fontWeight: '500',
    color: colors.outlineBlack,
  },
  caption: {
    marginTop: 6,
    fontFamily: fonts.regular,
    fontSize: 9,
    lineHeight: 11,
    color: colors.darkGray,
    textAlign: 'center',
  },
  divider: {
    marginTop: 10,
    height: 1,
    width: '100%',
    backgroundColor: colors.lightGray,
  },
});
