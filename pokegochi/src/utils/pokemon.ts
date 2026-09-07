import { Stats, Starter, EvolutionStep } from '../types/game';

// Garante que um valor de atributo fique sempre entre 0 e 100
export function clamp(valor: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, valor));
}

// Quantidade de experiência necessária para subir de nível.
// Fórmula simples e crescente: nível 1 precisa de 100xp, nível 2 de 200xp, etc.
export function expParaProximoNivel(nivelAtual: number): number {
  return nivelAtual * 100;
}

// Decide qual mensagem exibir com base nos atributos atuais.
// Agora todos os atributos seguem a mesma regra: quanto MENOR o valor, pior.
// A ordem importa: se vários estiverem ruins ao mesmo tempo, mostramos o
// mais "urgente" primeiro.
export function calcularStatusMensagem(stats: Stats): string {
  if (stats.saciedade <= 25) return 'Estou com fome!';
  if (stats.energia <= 20) return 'Estou cansado...';
  if (stats.higiene <= 25) return 'Preciso de um banho!';
  if (stats.felicidade <= 25) return 'Estou triste.';
  return 'Estou ótimo!';
}

// Verifica se o Pokémon já atingiu o nível necessário para a próxima evolução.
// "estagioAtual" indica quantas evoluções já aconteceram (0 = forma base).
export function verificarEvolucao(
  starter: Starter,
  nivel: number,
  estagioAtual: number
): EvolutionStep | null {
  const proximaEvolucao = starter.evolutions[estagioAtual];
  if (proximaEvolucao && nivel >= proximaEvolucao.level) {
    return proximaEvolucao;
  }
  return null;
}