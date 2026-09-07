import React from 'react'
import { StyleSheet } from 'react-native'
import {
  Card,
  Button,
  Text,
} from 'react-native-paper'

import { Pokemon } from '../types/Pokemon'

interface PokemonCardProps {
  pokemon: Pokemon
  onEscolher: () => void
}

export default function PokemonCard({
  pokemon,
  onEscolher,
}: PokemonCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Cover
        source={{ uri: pokemon.imagem }}
        style={styles.imagem}
      />

      <Card.Content style={styles.conteudo}>
        <Text variant="titleLarge" style={styles.nome}>
          {pokemon.nome.toUpperCase()}
        </Text>

        <Text style={styles.info}>
          Pokédex: #{pokemon.id}
        </Text>

        <Text style={styles.info}>
          Tipo: {pokemon.tipos.join(' / ')}
        </Text>

        <Text style={styles.info}>
          XP base: {pokemon.experienciaBase}
        </Text>
      </Card.Content>

      <Card.Actions>
        <Button
          mode="contained"
          onPress={onEscolher}
          style={styles.botao}
        >
          Escolher
        </Button>
      </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 18,
    overflow: 'hidden',
  },

  imagem: {
    height: 150,
    resizeMode: 'contain',
    backgroundColor: '#F1F3F5',
  },

  conteudo: {
    paddingTop: 10,
  },

  nome: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  info: {
    marginTop: 3,
    color: '#555',
  },

  botao: {
    marginRight: 10,
    marginBottom: 5,
    borderRadius: 10,
  },
})