import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// Tema usado pelo PaperProvider (App.tsx)
export const pokeTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#E3350D', // vermelho pokébola
    secondary: '#3B4CCA', // azul pokémon
    tertiary: '#FFDE00', // amarelo pikachu
    background: '#F4F6FF',
    surface: '#FFFFFF',
    error: '#E3350D',
  },
};

// Paleta de cores "soltas", usada diretamente nos estilos das telas
export const cores = {
  vermelho: '#E3350D',
  azul: '#3B4CCA',
  amarelo: '#FFDE00',
  verde: '#4CAF50',
  cinza: '#78909C',
  fundo: '#F4F6FF',
  fome: '#FF7043',
  felicidade: '#FFCA28',
  energia: '#42A5F5',
  higiene: '#66BB6A',
};