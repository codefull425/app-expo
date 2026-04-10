import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, layout } from '../constants/theme';

type Props = {
  label: string;
};

export function CategoryHeading({ label }: Props): React.ReactElement {
  return React.createElement(
    View,
    { style: styles.row },
    React.createElement(View, { style: styles.line }),
    React.createElement(Text, { style: styles.label }, label),
    React.createElement(View, { style: styles.line }),
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: layout.catalogMaxWidth,
    alignSelf: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primaryGreen,
    minWidth: 40,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryGreen,
  },
});
