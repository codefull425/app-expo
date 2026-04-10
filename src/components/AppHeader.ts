import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FIGMA_ASSETS } from '../constants/figmaAssets';
import { hamburgerMenu } from '../constants/localImages';
import { colors, layout } from '../constants/theme';

type Props = {
  menuExpanded: boolean;
  onMenuPress: () => void;
};

const headerInnerFrame = {
  height: layout.appHeaderHeight,
  maxHeight: layout.appHeaderHeight,
  minHeight: layout.appHeaderHeight,
} as const;

export function AppHeader({ menuExpanded, onMenuPress }: Props): React.ReactElement {
  const insets = useSafeAreaInsets();
  return React.createElement(
    View,
    { style: [styles.headerOuter, { paddingTop: insets.top }] },
    React.createElement(
      View,
      { style: [styles.headerInner, headerInnerFrame] },
      React.createElement(
        Pressable,
        {
          style: styles.iconBtn,
          onPress: onMenuPress,
          accessibilityLabel: 'Menu',
          accessibilityRole: 'button',
          accessibilityState: { expanded: menuExpanded },
          hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
        },
        React.createElement(Image, {
          source: hamburgerMenu,
          style: styles.hamburgerImg,
          contentFit: 'contain' as const,
          accessibilityIgnoresInvertColors: true,
        }),
      ),
      React.createElement(
        View,
        { style: styles.logoWrap },
        React.createElement(Image, {
          source: { uri: FIGMA_ASSETS.logoCantina },
          style: styles.logoImg,
          contentFit: 'contain' as const,
          accessibilityLabel: 'Cantina',
        }),
      ),
      React.createElement(
        View,
        { style: styles.profile, accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const },
        React.createElement(Image, {
          source: { uri: FIGMA_ASSETS.avatarRing },
          style: styles.avatarRing,
          contentFit: 'contain' as const,
        }),
        React.createElement(
          View,
          { style: styles.avatarChip },
          React.createElement(Image, {
            source: { uri: FIGMA_ASSETS.avatarMask },
            style: styles.avatarPhoto,
            contentFit: 'cover' as const,
          }),
        ),
        React.createElement(Image, {
          source: { uri: FIGMA_ASSETS.avatarIcon },
          style: styles.avatarChevron,
          contentFit: 'contain' as const,
        }),
      ),
    ),
  );
}

const styles = StyleSheet.create({
  headerOuter: {
    position: 'relative',
    zIndex: 30,
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: colors.primaryGreen,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingHorizontal: 12,
  },
  iconBtn: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerImg: {
    width: 30,
    height: 30,
  },
  logoWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: 44,
    height: 30,
  },
  profile: {
    position: 'relative',
    width: 60,
    height: 30,
  },
  avatarRing: {
    position: 'absolute',
    left: 0,
    top: 2,
    width: 28,
    height: 28,
  },
  avatarChip: {
    position: 'absolute',
    left: 27,
    top: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPhoto: {
    width: 24,
    height: 24,
  },
  avatarChevron: {
    position: 'absolute',
    right: 0,
    top: 8,
    width: 15,
    height: 15,
  },
});
