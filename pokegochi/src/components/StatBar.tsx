import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ProgressBar, Text } from 'react-native-paper'

interface StatBarProps {
  nome: string
  valor: number
}

export default function StatBar({ nome, valor }: StatBarProps) {
  const progresso = valor / 100

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.nome}>{nome}</Text>

        <Text style={styles.valor}>
          {Math.round(valor)}/100
        </Text>
      </View>

      <ProgressBar
        progress={progresso}
        style={styles.barra}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },

  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  nome: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  valor: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  barra: {
    height: 10,
    borderRadius: 10,
  },
})