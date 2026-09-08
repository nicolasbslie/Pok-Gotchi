import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedProgress } from '../types/game';

const CHAVE_PROGRESSO = '@pokegochi:progresso';

// Salva todo o progresso atual do jogo de uma vez só
export async function salvarProgresso(progresso: SavedProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(progresso));
  } catch (erro) {
    console.warn('Não foi possível salvar o progresso', erro);
  }
}

// Tenta carregar o progresso salvo. Retorna null se nunca salvou nada.
export async function carregarProgresso(): Promise<SavedProgress | null> {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_PROGRESSO);
    return bruto ? JSON.parse(bruto) : null;
  } catch (erro) {
    console.warn('Não foi possível carregar o progresso', erro);
    return null;
  }
}

// Apaga o progresso salvo (para um botão de apagar progresso ainda não adicionado)
export async function limparProgresso(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CHAVE_PROGRESSO);
  } catch (erro) {
    console.warn('Não foi possível limpar o progresso', erro);
  }
}