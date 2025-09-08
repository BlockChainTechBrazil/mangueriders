/**
 * Paleta de cores para o projeto GAYA
 * Inspirada no carnaval de Recife, mar de Boa Viagem e cores do frevo
 */

export const COLORS = {
  // Primárias
  primary: {
    DEFAULT: '#FF5A00', // Laranja vibrante (frevo)
    light: '#FF7D33',
    dark: '#D94D00',
  },

  // Secundárias
  secondary: {
    DEFAULT: '#00B2FF', // Azul do mar de Boa Viagem
    light: '#33C5FF',
    dark: '#0095D9',
  },

  // Acentuação
  accent: {
    DEFAULT: '#FFCC00', // Amarelo do sol
    light: '#FFDB4D',
    dark: '#D9AD00',
  },

  // Cores complementares (carnaval)
  complementary: {
    pink: '#FF00AA',    // Rosa choque
    purple: '#A200FF',  // Roxo
    green: '#00D95F',   // Verde frevo
  },

  // Tons neutros
  neutral: {
    black: '#000000',
    darkGray: '#333333',
    midGray: '#777777',
    lightGray: '#CCCCCC',
    white: '#FFFFFF',
    offWhite: '#F7F7F7',
  },

  // Cores semânticas
  semantic: {
    success: '#00B268',
    warning: '#FFB100',
    error: '#FF3B30',
    info: '#0075FF',
  },

  // Gradientes predefinidos
  gradients: {
    carnival: 'linear-gradient(135deg, #FF5A00 0%, #FF00AA 50%, #A200FF 100%)',
    sunset: 'linear-gradient(135deg, #FF5A00 0%, #FFCC00 100%)',
    ocean: 'linear-gradient(135deg, #00B2FF 0%, #0075FF 100%)',
  }
};

export default COLORS;
