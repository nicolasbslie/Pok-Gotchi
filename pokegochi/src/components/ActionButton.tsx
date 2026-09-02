import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'

interface ActionButtonProps {
  titulo: string
  icone: string
  onPress: () => void
}

export default function ActionButton({
  titulo,
  icone,
  onPress,
}: ActionButtonProps) {
  return (
    <Button
      mode="contained"
      icon={icone}
      onPress={onPress}
      style={styles.botao}
      contentStyle={styles.conteudo}
      labelStyle={styles.texto}
    >
      {titulo}
    </Button>
  )
}

const styles = StyleSheet.create({
  botao: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
  },

  conteudo: {
    height: 48,
  },

  texto: {
    fontSize: 12,
    fontWeight: 'bold',
  },
})