import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface ActionButtonProps {
  label: string;
  icon: string; // emoji
  color: string;
  onPress: () => void;
}

// Botão de ação reutilizável (Alimentar, Brincar, Dormir, Limpar, Treinar)
export default function ActionButton({ label, icon, color, onPress }: ActionButtonProps) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={[styles.button, { backgroundColor: color }]}
      labelStyle={styles.label}
      compact
    >
      {icon} {label}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: { margin: 4, borderRadius: 14, minWidth: 100 },
  label: { fontSize: 13, fontWeight: '700' },
});
