import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { STARTERS } from '../data/starters';
import { fetchPokemonData } from '../services/pokeApi';
import { Starter, PokemonInfo } from '../types/game';
import Pokeball from '../components/Pokeball';
import { cores } from '../theme';

interface SelectStarterPageProps {
  onSelecionar: (starter: Starter, pokemon: PokemonInfo) => void;
}

// Junta cada Starter fixo com os dados que vieram da PokeAPI, para exibir no card
interface OpcaoInicial {
  starter: Starter;
  pokemon: PokemonInfo;
}

export default function SelectStarterPage({ onSelecionar }: SelectStarterPageProps) {
  // Guarda as 3 opções já com dados da PokeAPI (nome, imagem, tipos)
  const [opcoes, setOpcoes] = useState<OpcaoInicial[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Ao montar a tela, busca na PokeAPI os dados dos 3 iniciais em paralelo
  useEffect(() => {
    async function carregarIniciais() {
      const resultados = await Promise.all(
        STARTERS.map(async (starter) => ({
          starter,
          pokemon: await fetchPokemonData(starter.pokeApiId),
        }))
      );
      setOpcoes(resultados);
      setCarregando(false);
    }
    carregarIniciais();
  }, []);

  if (carregando) {
    return (
      <View style={styles.loading}>
        <Pokeball size={70} />
        <ActivityIndicator style={{ marginTop: 16 }} color={cores.vermelho} />
        <Text style={{ marginTop: 8 }}>Carregando Pokémon...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.titulo}>Escolha seu parceiro!</Text>
      <Text style={styles.subtitulo}>Essa escolha vai acompanhar você na jornada</Text>

      {opcoes.map(({ starter, pokemon }) => (
        <Card key={starter.id} style={styles.card} onPress={() => onSelecionar(starter, pokemon)}>
          <Card.Content style={styles.cardConteudo}>
            <Image source={{ uri: pokemon.image }} style={styles.imagem} resizeMode="contain" />
            <Text variant="titleLarge" style={styles.nome}>{pokemon.name}</Text>
            <Text style={styles.tipo}>Tipo: {pokemon.types.join(', ')}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', backgroundColor: cores.fundo, flexGrow: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.fundo },
  titulo: { color: cores.vermelho, fontWeight: '800', marginTop: 24, textAlign: 'center' },
  subtitulo: { color: cores.cinza, marginBottom: 20, textAlign: 'center' },
  card: { width: '100%', marginBottom: 16, borderRadius: 16, elevation: 3, backgroundColor: '#fff' },
  cardConteudo: { alignItems: 'center', paddingVertical: 12 },
  imagem: { width: 140, height: 140, marginBottom: 8 },
  nome: { textTransform: 'capitalize', color: cores.azul },
  tipo: { textTransform: 'capitalize', color: cores.cinza },
});
