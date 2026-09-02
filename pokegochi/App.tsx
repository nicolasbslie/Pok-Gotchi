import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import SelectStarterPage from './src/pages/SelectStarterPage';
import GamePage from './src/pages/GamePage';
import { Starter, PokemonInfo } from './src/types/game';
import { pokeTheme } from './src/theme';

// e guarda qual foi o Pokémon escolhido pelo jogador.
export default function App() {
  const [starterEscolhido, setStarterEscolhido] = useState<Starter | null>(null);
  const [pokemonEscolhido, setPokemonEscolhido] = useState<PokemonInfo | null>(null);

  function handleSelecionar(starter: Starter, pokemon: PokemonInfo) {
    setStarterEscolhido(starter);
    setPokemonEscolhido(pokemon);
  }

  return (
    <PaperProvider theme={pokeTheme}>
      <StatusBar barStyle="dark-content" />
      {!starterEscolhido || !pokemonEscolhido ? (
        <SelectStarterPage onSelecionar={handleSelecionar} />
      ) : (
        <GamePage starter={starterEscolhido} pokemonInicial={pokemonEscolhido} />
      )}
    </PaperProvider>
  );
}
