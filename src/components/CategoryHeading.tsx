import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, layout } from '../constants/theme';

type Props = {
  label: string;
};

export function CategoryHeading({ label }: Props): React.ReactElement {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
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
