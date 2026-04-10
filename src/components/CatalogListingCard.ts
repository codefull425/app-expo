import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, layout } from '../constants/theme';

export type CatalogListingCardProps = {
  name: string;
  price: string;
  description: string;
  onPress: () => void;
};

/**
 * Linha de listagem inspirada no frame "Card" do Figma (histórico), adaptada ao nosso domínio:
 * só nome, descrição e preço do item de catálogo — sem datas nem movimentações.
 */
export function CatalogListingCard({
  name,
  price,
  description,
  onPress,
}: CatalogListingCardProps): React.ReactElement {
  const caption = description.trim();

  return React.createElement(
    Pressable,
    {
      onPress,
      style: styles.pressable,
      accessibilityRole: 'button',
      accessibilityLabel: `${name}, ${price}`,
    },
    React.createElement(
      View,
      { style: styles.inner },
      React.createElement(
        View,
        { style: styles.nameRow },
        React.createElement(
          Text,
          { style: styles.name, numberOfLines: 2 },
          name,
        ),
        React.createElement(Text, { style: styles.price }, price),
      ),
      caption.length > 0
        ? React.createElement(
            Text,
            { style: styles.caption, numberOfLines: 2 },
            caption,
          )
        : null,
      React.createElement(View, { style: styles.divider }),
    ),
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
