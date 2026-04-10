import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import { Animated, BackHandler, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cardapioWhite, listagem } from '../constants/localImages';
import { colors, layout } from '../constants/theme';

type Props = {
  open: boolean;
  onClose: () => void;
  onHeaderClick: () => void;
  onScheduleClick: () => void;
};

const SLIDE_MS = 220;
const FADE_MS = 200;
const PANEL_WIDTH = 83;
const SIDEBAR_TOP = layout.appHeaderHeight;

export function MobileSidebar({
  open,
  onClose,
  onHeaderClick,
  onScheduleClick,
}: Props): React.ReactElement | null {
  const insets = useSafeAreaInsets();
  const sidebarTop = insets.top + SIDEBAR_TOP;
  const slide = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!open) return;
    slide.setValue(-PANEL_WIDTH);
    fade.setValue(0);
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: SLIDE_MS,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: FADE_MS,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open, slide, fade]);

  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [open, onClose]);

  useEffect(() => {
    if (!open || Platform.OS !== 'web') return;
    if (typeof document === 'undefined') return;
    const onKey: EventListener = (e) => {
      if (e instanceof KeyboardEvent && e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const fire = (handler: () => void) => {
    handler();
    queueMicrotask(() => onClose());
  };

  return (
    <View style={styles.layer} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, { opacity: fade }]} pointerEvents="box-none">
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Fechar menu"
          accessibilityRole="button"
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.panel,
          {
            top: sidebarTop,
            bottom: 0,
            transform: [{ translateX: slide }],
          },
        ]}
        accessibilityViewIsModal
        accessibilityLabel="Menu lateral"
      >
        <View style={styles.rail}>
          <View style={styles.fundo} pointerEvents="none" />
          <View style={styles.accent} pointerEvents="none" />
          <View style={styles.nav}>
            <Pressable
              style={[styles.cell, styles.cellLogo]}
              onPress={() => fire(onHeaderClick)}
              accessibilityLabel="Início"
              accessibilityRole="button"
            >
              <Image
                source={cardapioWhite}
                style={styles.cellImage}
                contentFit="cover"
                pointerEvents="none"
              />
            </Pressable>
            <Pressable
              style={[styles.cell, styles.cellAlunos]}
              onPress={() => fire(onScheduleClick)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              accessibilityLabel="Agenda"
              accessibilityRole="button"
            >
              <Image
                source={listagem}
                style={styles.cellImage}
                contentFit="cover"
                pointerEvents="none"
              />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 25,
  },
  backdrop: {
    position: 'absolute',
    left: PANEL_WIDTH,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: SIDEBAR_TOP,
    width: PANEL_WIDTH,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  rail: {
    flex: 1,
    width: PANEL_WIDTH,
    position: 'relative',
    overflow: 'hidden',
  },
  fundo: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: colors.lightGray,
  },
  accent: {
    position: 'absolute',
    left: 80,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.primaryGreen,
  },
  nav: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 80,
    bottom: 0,
    zIndex: 1,
  },
  cell: {
    position: 'absolute',
    left: 0,
    width: 80,
    height: 80,
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  cellImage: {
    width: '100%',
    height: '100%',
  },
  cellLogo: {
    top: 0,
    backgroundColor: colors.lightGray,
    borderWidth: 3,
    borderColor: colors.white,
  },
  cellAlunos: {
    top: 83,
    backgroundColor: colors.lightGray,
    borderWidth: 3,
    borderColor: colors.white,
  },
});
