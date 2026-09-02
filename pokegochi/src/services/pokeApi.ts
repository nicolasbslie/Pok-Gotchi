import { PokemonInfo } from '../types/game';

// Busca os dados de um Pokémon na PokeAPI a partir do id (número) ou do nome.
// É a única função que fala com a API — o resto do app usa apenas o
// objeto PokemonInfo já tratado, sem se preocupar com o formato bruto da API.
export async function fetchPokemonData(idOuNome: number | string): Promise<PokemonInfo> {
  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOuNome}`);

  if (!resposta.ok) {
    throw new Error(`Não foi possível buscar o Pokémon ${idOuNome}`);
  }

  const dados = await resposta.json();

  return {
    pokeApiId: dados.id,
    name: dados.name,
    // artwork oficial é mais bonita; se não existir, usa o sprite padrão
    image:
      dados.sprites?.other?.['official-artwork']?.front_default ||
      dados.sprites?.front_default,
    types: dados.types.map((t: any) => t.type.name),
    dexNumber: dados.id,
  };
}