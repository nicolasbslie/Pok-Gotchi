import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator, Button, IconButton } from 'react-native-paper';
import { STARTERS } from '../data/starters';
import { fetchPokemonData } from '../services/pokeApi';
import { Starter, PokemonInfo } from '../types/game';
import { getCorTipo } from '../utils/Typecolors';
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
  // Guarda as 3 opções já com dados da PokeAPI (nome, imagem, tipos, altura, peso)
  const [opcoes, setOpcoes] = useState<OpcaoInicial[]>([]);
  const [carregando, setCarregando] = useState(true);
  // Qual das 3 opções está em destaque no centro da tela no momento
  const [indice, setIndice] = useState(0);

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
      <View style={styles.tela}>
        <View style={[styles.painel, styles.loading]}>
          <Pokeball size={70} />
          <ActivityIndicator style={{ marginTop: 16 }} color={cores.amarelo} />
          <Text style={styles.loadingTexto}>Carregando Pokémon...</Text>
        </View>
      </View>
    );
  }

  const opcaoAtual = opcoes[indice];
  const pokemonAtual = opcaoAtual.pokemon;
  const corPrincipal = getCorTipo(pokemonAtual.types[0]);

  function irParaAnterior() {
    setIndice((i) => (i - 1 + opcoes.length) % opcoes.length);
  }

  function irParaProximo() {
    setIndice((i) => (i + 1) % opcoes.length);
  }

  return (
    <View style={styles.tela}>
      <View style={styles.painel}>
        {/* Cabeçalho estilo "console" */}
        <View style={[styles.cabecalho, { backgroundColor: corPrincipal }]}>
          <Text style={styles.cabecalhoTexto}>Seleção Inicial</Text>
          <Pokeball size={26} />
        </View>

        {/* Nome/tipo à esquerda e ficha (altura/peso/tipo) à direita */}
        <View style={styles.infoLinha}>
          <View style={styles.infoNome}>
            <Text style={styles.nomeTexto}>{pokemonAtual.name}</Text>
            <View style={[styles.tipoChip, { backgroundColor: corPrincipal }]}>
              <Text style={styles.tipoChipTexto}>{pokemonAtual.types[0]}</Text>
            </View>
          </View>
          <View style={styles.infoFicha}>
            <Text style={styles.fichaTexto}>Altura: {pokemonAtual.height.toFixed(1)} m</Text>
            <Text style={styles.fichaTexto}>Peso: {pokemonAtual.weight.toFixed(1)} kg</Text>
            <Text style={styles.fichaTexto}>Tipo: {pokemonAtual.types.join(', ')}</Text>
          </View>
        </View>

        {/* Retrato grande do Pokémon em destaque */}
        <View style={styles.retratoContainer}>
          <View style={[styles.retratoCirculo, { borderColor: corPrincipal }]}>
            <Image source={{ uri: pokemonAtual.image }} style={styles.retratoImagem} resizeMode="contain" />
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => onSelecionar(opcaoAtual.starter, pokemonAtual)}
          style={[styles.botaoEscolher, { backgroundColor: corPrincipal }]}
          labelStyle={styles.botaoEscolherTexto}
        >
          Escolher {pokemonAtual.name}!
        </Button>

        {/* Carrossel inferior para trocar de opção */}
        <View style={styles.carrossel}>
          <IconButton icon="chevron-left" iconColor="#fff" onPress={irParaAnterior} />
          <View style={styles.miniaturas}>
            {opcoes.map((op, i) => (
              <TouchableOpacity key={op.starter.id} onPress={() => setIndice(i)}>
                <View
                  style={[
                    styles.miniaturaCirculo,
                    i === indice && { borderColor: getCorTipo(op.pokemon.types[0]), borderWidth: 3 },
                  ]}
                >
                  <Image source={{ uri: op.pokemon.image }} style={styles.miniaturaImagem} resizeMode="contain" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <IconButton icon="chevron-right" iconColor="#fff" onPress={irParaProximo} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, alignItems: 'center', justifyContent: 'center', padding: 16 },
  painel: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: cores.painelEscuro,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
  },
  loading: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  loadingTexto: { color: cores.painelTexto, marginTop: 8 },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  cabecalhoTexto: { color: '#fff', fontWeight: '800', fontSize: 20, letterSpacing: 0.5 },
  infoLinha: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  infoNome: { width: '42%' },
  nomeTexto: { color: cores.painelTexto, fontWeight: '800', fontSize: 18, textTransform: 'capitalize', marginBottom: 6 },
  tipoChip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tipoChipTexto: { color: '#fff', fontWeight: '700', fontSize: 11, textTransform: 'capitalize' },
  infoFicha: { width: '54%', backgroundColor: cores.painelSecundario, borderRadius: 12, padding: 10 },
  fichaTexto: { color: cores.painelTexto, fontSize: 12, marginBottom: 2, textTransform: 'capitalize' },
  retratoContainer: { alignItems: 'center', marginVertical: 6 },
  retratoCirculo: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    backgroundColor: cores.painelSecundario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retratoImagem: { width: 140, height: 140 },
  botaoEscolher: { alignSelf: 'center', borderRadius: 20, marginTop: 14, marginBottom: 12, paddingHorizontal: 8 },
  botaoEscolherTexto: { color: '#fff', fontWeight: '800', fontSize: 14 },
  carrossel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 14 },
  miniaturas: { flexDirection: 'row' },
  miniaturaCirculo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: cores.painelSecundario,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniaturaImagem: { width: 42, height: 42 },
});
