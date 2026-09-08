import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { Starter, PokemonInfo, Stats, SavedProgress } from '../types/game';
import { fetchPokemonData } from '../services/pokeApi';
import { salvarProgresso } from '../services/storage';
import {
  clamp,
  expParaProximoNivel,
  calcularStatusMensagem,
  verificarEvolucao,
} from '../utils/pokemon';
import { getCorTipo } from '../utils/TypeColors';
import StatBar from '../components/StatBar';
import ActionButton from '../components/ActionButton';
import { cores } from '../theme';

interface GamePageProps {
  starter: Starter;
  pokemonInicial: PokemonInfo;
  progressoSalvo?: SavedProgress | null; // dados recuperados do AsyncStorage, se existirem
}

// Intervalo (em ms) em que os atributos mudam sozinhos com o passar do tempo
const INTERVALO_TEMPO = 4000;

export default function GamePage({ starter, pokemonInicial, progressoSalvo }: GamePageProps) {
  // Dados atuais do Pokémon exibido (mudam quando ele evolui)
  // Se tiver progresso salvo, começa a partir dele; senão usa o inicial escolhido agora
  const [pokemon, setPokemon] = useState<PokemonInfo>(progressoSalvo?.pokemon ?? pokemonInicial);
  // Quantas evoluções já aconteceram (0 = forma inicial escolhida)
  const [estagio, setEstagio] = useState(progressoSalvo?.estagio ?? 0);

  const [nivel, setNivel] = useState(progressoSalvo?.nivel ?? 1);
  const [exp, setExp] = useState(progressoSalvo?.exp ?? 0);

  // Atributos principais do Pokémon, todos de 0 a 100.
  // Os 4 seguem a mesma regra agora: quanto MAIOR, melhor, e todos caem
  // sozinhos com o tempo. Alimentar recupera a saciedade.
  const [stats, setStats] = useState<Stats>(
    progressoSalvo?.stats ?? {
      saciedade: 80,
      felicidade: 80,
      energia: 80,
      higiene: 80,
    }
  );

  // Mensagens temporárias exibidas em destaque no topo da tela
  const [avisoNivel, setAvisoNivel] = useState<string | null>(null);
  const [avisoEvolucao, setAvisoEvolucao] = useState<string | null>(null);

  // ------------------------------------------------------------------
  // PASSAGEM DO TEMPO
  // A cada INTERVALO_TEMPO ms os 4 atributos diminuem sozinhos, simulando
  // o Pokémon "vivendo" mesmo sem interação do jogador.
  // ------------------------------------------------------------------
  useEffect(() => {
    const intervalo = setInterval(() => {
      setStats((atual) => ({
        saciedade: clamp(atual.saciedade - 3),
        felicidade: clamp(atual.felicidade - 2),
        energia: clamp(atual.energia - 2),
        higiene: clamp(atual.higiene - 1),
      }));
    }, INTERVALO_TEMPO);

    // limpa o intervalo quando a tela é desmontada, evitando vazamento de memória
    return () => clearInterval(intervalo);
  }, []);

  // ------------------------------------------------------------------
  // SISTEMA DE EVOLUÇÃO
  // Sempre que o nível muda, verifica se o Pokémon já atingiu o nível
  // necessário para evoluir. Se sim, busca o próximo estágio na PokeAPI.
  // ------------------------------------------------------------------
  useEffect(() => {
    const proximaEvolucao = verificarEvolucao(starter, nivel, estagio);
    if (!proximaEvolucao) return;

    async function evoluir() {
      const novoPokemon = await fetchPokemonData(proximaEvolucao!.pokeApiId);
      setAvisoEvolucao(`${pokemon.name} evoluiu para ${novoPokemon.name}!`);
      setPokemon(novoPokemon);
      setEstagio((atual) => atual + 1);
    }
    evoluir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nivel]);

  // Some com os avisos depois de alguns segundos
  useEffect(() => {
    if (!avisoNivel) return;
    const t = setTimeout(() => setAvisoNivel(null), 3000);
    return () => clearTimeout(t);
  }, [avisoNivel]);

  useEffect(() => {
    if (!avisoEvolucao) return;
    const t = setTimeout(() => setAvisoEvolucao(null), 3500);
    return () => clearTimeout(t);
  }, [avisoEvolucao]);

  // ------------------------------------------------------------------
  // PERSISTÊNCIA
  // Salva o progresso automaticamente sempre que algo relevante do jogo muda
  // (evolução, nível, exp ou os 4 atributos).
  // ------------------------------------------------------------------
  useEffect(() => {
    salvarProgresso({
      starter,
      pokemon,
      estagio,
      nivel,
      exp,
      stats,
    });
  }, [pokemon, estagio, nivel, exp, stats]);

  // Adiciona experiência e, se for suficiente, sobe de nível.
  // O nível novo dispara o useEffect de evolução acima automaticamente.
  function ganharExperiencia(quantidade: number) {
    const necessario = expParaProximoNivel(nivel);
    const novoExp = exp + quantidade;

    if (novoExp >= necessario) {
      setExp(novoExp - necessario);
      setAvisoNivel(`${pokemon.name} subiu para o nível ${nivel + 1}!`);
      setNivel((n) => n + 1);
    } else {
      setExp(novoExp);
    }
  }

  // ------------------------------------------------------------------
  // AÇÕES DO JOGADOR
  // Cada ação altera os atributos de forma coerente com o que representa.
  // ------------------------------------------------------------------
  function alimentar() {
    setStats((s) => ({ ...s, saciedade: clamp(s.saciedade + 25) }));
  }

  function brincar() {
    setStats((s) => ({
      ...s,
      felicidade: clamp(s.felicidade + 15),
      energia: clamp(s.energia - 10),
      saciedade: clamp(s.saciedade - 5),
    }));
  }

  function dormir() {
    setStats((s) => ({ ...s, energia: clamp(s.energia + 30) }));
  }

  function limpar() {
    setStats((s) => ({ ...s, higiene: clamp(s.higiene + 25) }));
  }

  function treinar() {
    setStats((s) => ({
      ...s,
      energia: clamp(s.energia - 15),
      saciedade: clamp(s.saciedade - 10),
    }));
    ganharExperiencia(20);
  }

  const statusMensagem = calcularStatusMensagem(stats);
  const expNecessario = expParaProximoNivel(nivel);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dexNumero}>Nº {String(pokemon.dexNumber).padStart(3, '0')}</Text>
        <View style={styles.chips}>
          {pokemon.types.map((tipo) => (
            <Chip
              key={tipo}
              style={[styles.chip, { backgroundColor: getCorTipo(tipo) }]}
              textStyle={styles.chipTexto}
            >
              {tipo}
            </Chip>
          ))}
        </View>
      </View>

      {(avisoNivel || avisoEvolucao) && (
        <Card style={styles.aviso}>
          <Card.Content>
            <Text style={styles.avisoTexto}>{avisoEvolucao || avisoNivel}</Text>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.cardPokemon}>
        <Card.Content style={{ alignItems: 'center' }}>
          <Image source={{ uri: pokemon.image }} style={styles.imagem} resizeMode="contain" />
          <Text variant="headlineSmall" style={styles.nome}>{pokemon.name}</Text>
          <Text style={styles.nivel}>Nível {nivel}</Text>
          <Text style={styles.status}>{statusMensagem}</Text>
        </Card.Content>
      </Card>

      <View style={styles.expContainer}>
        <Text style={styles.expTexto}>EXP: {exp} / {expNecessario}</Text>
        <View style={styles.expFundo}>
          <View style={[styles.expPreenchido, { width: `${(exp / expNecessario) * 100}%` }]} />
        </View>
      </View>

      <Card style={styles.cardAtributos}>
        <Card.Content>
          <StatBar label="Saciedade" icon="🍖" value={stats.saciedade} color={cores.saciedade} />
          <StatBar label="Felicidade" icon="😊" value={stats.felicidade} color={cores.felicidade} />
          <StatBar label="Energia" icon="⚡" value={stats.energia} color={cores.energia} />
          <StatBar label="Higiene" icon="🛁" value={stats.higiene} color={cores.higiene} />
        </Card.Content>
      </Card>

      <View style={styles.acoes}>
        <ActionButton label="Alimentar" icon="🍖" color={cores.saciedade} onPress={alimentar} />
        <ActionButton label="Brincar" icon="🎾" color={cores.felicidade} onPress={brincar} />
        <ActionButton label="Dormir" icon="💤" color={cores.energia} onPress={dormir} />
        <ActionButton label="Limpar" icon="🧼" color={cores.higiene} onPress={limpar} />
        <ActionButton label="Treinar" icon="🏋️" color={cores.azul} onPress={treinar} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: cores.fundo, flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dexNumero: { fontWeight: '700', color: cores.cinza },
  chips: { flexDirection: 'row' },
  chip: { marginLeft: 4 },
  chipTexto: { color: '#fff', textTransform: 'capitalize', fontSize: 11 },
  aviso: { backgroundColor: cores.amarelo, marginBottom: 10, borderRadius: 12 },
  avisoTexto: { textAlign: 'center', fontWeight: '700', color: '#5D4037' },
  cardPokemon: { borderRadius: 20, marginBottom: 12, elevation: 3, backgroundColor: '#fff' },
  imagem: { width: 180, height: 180 },
  nome: { textTransform: 'capitalize', color: cores.vermelho, marginTop: 6 },
  nivel: { color: cores.azul, fontWeight: '700', marginTop: 2 },
  status: { marginTop: 6, fontStyle: 'italic', color: '#546E7A' },
  expContainer: { marginBottom: 12 },
  expTexto: { fontSize: 12, color: cores.cinza, marginBottom: 4 },
  expFundo: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  expPreenchido: { height: 8, backgroundColor: cores.amarelo },
  cardAtributos: { borderRadius: 16, marginBottom: 16, elevation: 2, backgroundColor: '#fff' },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
});