import { Starter } from '../types/game';

// Lista fixa dos 3 iniciais disponíveis para escolha.
// pokeApiId é o ID usado para buscar os dados na PokeAPI.
// "evolutions" guarda em qual nível cada evolução acontece, em ordem.
export const STARTERS: Starter[] = [
  {
    id: 'bulbasaur',
    pokeApiId: 1,
    name: 'Bulbasaur',
    evolutions: [
      { level: 16, pokeApiId: 2, name: 'Ivysaur' },
      { level: 32, pokeApiId: 3, name: 'Venusaur' },
    ],
  },
  {
    id: 'charmander',
    pokeApiId: 4,
    name: 'Charmander',
    evolutions: [
      { level: 16, pokeApiId: 5, name: 'Charmeleon' },
      { level: 36, pokeApiId: 6, name: 'Charizard' },
    ],
  },
  {
    id: 'squirtle',
    pokeApiId: 7,
    name: 'Squirtle',
    evolutions: [
      { level: 16, pokeApiId: 8, name: 'Wartortle' },
      { level: 36, pokeApiId: 9, name: 'Blastoise' },
    ],
  },
];