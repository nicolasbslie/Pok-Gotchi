// Representa os 4 atributos do Pokémon, cada um variando de 0 a 100.
// Todos diminuem com o tempo; cada ação recupera um ou mais deles.
export interface Stats {
  saciedade: number;
  felicidade: number;
  energia: number;
  higiene: number;
}

// Um "degrau" de evolução: em qual nível ela acontece e para qual Pokémon
export interface EvolutionStep {
  level: number;
  pokeApiId: number;
  name: string;
}

// Um Pokémon inicial disponível na tela de seleção
export interface Starter {
  id: string;
  pokeApiId: number;
  name: string;
  evolutions: EvolutionStep[];
}

// Dados do Pokémon já tratados, vindos da PokeAPI
export interface PokemonInfo {
  pokeApiId: number;
  name: string;
  image: string;
  types: string[];
  dexNumber: number;
  height: number; // em metros
  weight: number; // em kg
}

// Formato de tudo que precisa ser salvo/restaurado do jogo
export interface SavedProgress {
  starter: Starter;
  pokemon: PokemonInfo;
  estagio: number;
  nivel: number;
  exp: number;
  stats: Stats;
}