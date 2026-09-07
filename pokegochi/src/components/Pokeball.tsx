import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface PokeballProps {
  size?: number;
  style?: ViewStyle;
}

// Pokébola decorativa feita só com Views + StyleSheet,
// usada como indicador de carregamento e como toque visual criativo.
export default function Pokeball({ size = 60, style }: PokeballProps) {
  const borda = Math.max(2, size * 0.05);
  return (
    <View style={[{ width: size, height: size }, style]}>
      <View
        style={[
          styles.metade,
          styles.topo,
          { width: size, height: size / 2, borderColor: '#2b2b2b', borderWidth: borda },
        ]}
      />
      <View
        style={[
          styles.metade,
          styles.base,
          { width: size, height: size / 2, borderColor: '#2b2b2b', borderWidth: borda },
        ]}
      />
      <View style={[styles.linha, { top: size / 2 - borda / 2, height: borda, backgroundColor: '#2b2b2b' }]} />
      <View
        style={[
          styles.centro,
          {
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: size * 0.16,
            top: size / 2 - (size * 0.32) / 2,
            left: size / 2 - (size * 0.32) / 2,
            borderWidth: borda,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  metade: { position: 'absolute' },
  topo: { top: 0, backgroundColor: '#E3350D', borderTopLeftRadius: 999, borderTopRightRadius: 999 },
  base: { bottom: 0, backgroundColor: '#FFFFFF', borderBottomLeftRadius: 999, borderBottomRightRadius: 999 },
  linha: { position: 'absolute', width: '100%' },
  centro: { position: 'absolute', backgroundColor: '#FFFFFF', borderColor: '#2b2b2b' },
});
