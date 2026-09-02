// Cores tradicionais associadas a cada tipo de Pokémon.
// Usado para colorir chips, bordas e botões de acordo com o tipo exibido.
const CORES_POR_TIPO: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

// Retorna a cor do tipo informado, ou um cinza neutro se o tipo não for reconhecido
export function getCorTipo(tipo: string): string {
  return CORES_POR_TIPO[tipo] || '#777777';
}