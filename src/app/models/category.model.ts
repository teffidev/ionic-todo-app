export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface CategoryColor {
  name: string;
  value: string;
}

export const CATEGORY_COLORS: CategoryColor[] = [
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Ámbar', value: '#f59e0b' },
  { name: 'Esmeralda', value: '#10b981' },
  { name: 'Rojo', value: '#ef4444' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Violeta', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Teal', value: '#14b8a6' },
];
