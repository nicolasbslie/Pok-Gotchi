import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';

interface StatBarProps {
  label: string;
  icon: string; // emoji
  value: number; // 0 a 100
  color: string;
}

// Barra de atributo reutilizável (fome, felicidade, energia, higiene).
// Só exibe o valor recebido — não conhece a lógica do jogo.
export default function StatBar({ label, icon, value, color }: StatBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{icon} {label}</Text>
        <Text style={styles.value}>{Math.round(value)}%</Text>
      </View>
      <ProgressBar progress={value / 100} color={color} style={styles.bar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 6 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  label: { fontSize: 13, fontWeight: '600', color: '#37474F' },
  value: { fontSize: 12, color: '#78909C' },
  bar: { height: 10, borderRadius: 6 },
});
