/** Alinhado a cantina-app/src/styles.scss */
export const colors = {
  primaryGreen: '#008267',
  darkGray: '#9d9d9d',
  lightGray: '#f1f1f1',
  white: '#ffffff',
  outlineBlack: '#000000',
} as const;

export const spacing = {
  screenPadding: 20,
  gridGap: 16,
  gridRowGap: 20,
} as const;

export const layout = {
  catalogMaxWidth: 372,
  itemCardMaxWidth: 176,
  /** Altura da faixa do header (abaixo da status bar); com safe area = insetTop + este valor. */
  appHeaderHeight: 48,
} as const;

/** Nomes registados por @expo-google-fonts/roboto após useFonts */
export const fonts = {
  regular: 'Roboto_400Regular',
  medium: 'Roboto_500Medium',
  semibold: 'Roboto_600SemiBold',
  bold: 'Roboto_700Bold',
  extrabold: 'Roboto_800ExtraBold',
} as const;
