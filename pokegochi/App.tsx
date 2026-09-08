import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import SelectStarterPage from './src/pages/SelectStarterPage';
import GamePage from './src/pages/GamePage';
import { Starter, PokemonInfo, SavedProgress } from './src/types/game';
import { pokeTheme } from './src/theme';
import { carregarProgresso, limparProgresso } from './src/services/storage';

export default function App() {
  const [starterEscolhido, setStarterEscolhido] = useState<Starter | null>(null);
  const [pokemonEscolhido, setPokemonEscolhido] = useState<PokemonInfo | null>(null);
  // Guarda o resto do progresso (nível, exp, stats) pra passar pro GamePage já pronto
  const [progressoSalvo, setProgressoSalvo] = useState<SavedProgress | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o app, tenta recuperar o progresso salvo antes de decidir qual tela mostrar
  useEffect(() => {
    async function iniciar() {
      const salvo = await carregarProgresso();
      if (salvo) {
        setStarterEscolhido(salvo.starter);
        setPokemonEscolhido(salvo.pokemon);
        setProgressoSalvo(salvo);
      }
      setCarregando(false);
    }
    iniciar();
  }, []);

  function handleSelecionar(starter: Starter, pokemon: PokemonInfo) {
    setStarterEscolhido(starter);
    setPokemonEscolhido(pokemon);
  }

  // Limpa o progresso salvo e volta pra tela de seleção de inicial
  function handleReiniciar() {
    limparProgresso();
    setStarterEscolhido(null);
    setPokemonEscolhido(null);
    setProgressoSalvo(null);
  }

  if (carregando) {
    return (
      <PaperProvider theme={pokeTheme}>
        <ActivityIndicator style={{ flex: 1 }} color={pokeTheme.colors.tertiary} />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={pokeTheme}>
      <StatusBar barStyle="dark-content" />
      {!starterEscolhido || !pokemonEscolhido ? (
        <SelectStarterPage onSelecionar={handleSelecionar} />
      ) : (
        <GamePage
          starter={starterEscolhido}
          pokemonInicial={pokemonEscolhido}
          progressoSalvo={progressoSalvo}
          onReiniciar={handleReiniciar}
        />
      )}
    </PaperProvider>
  );
}
