export const colors = {
  ink: '#17120F',
  orange: '#FF5B1F',
  milk: '#F4F2EF',
  foam: '#E3DED8',
  line: '#D2CCC5',
  muted: '#6B645D',
  card: '#FFFFFF',
  deep: '#26201C',
  soft: '#A39C94',
  cream: '#D8D3CD',
};

export const fonts = {
  display: 'Unbounded_600SemiBold',
  regular: 'GolosText_400Regular',
  medium: 'GolosText_500Medium',
  semibold: 'GolosText_600SemiBold',
  bold: 'GolosText_700Bold',
};

export const radius = { s: 12, m: 16, l: 20, xl: 24 };

export function rub(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}
