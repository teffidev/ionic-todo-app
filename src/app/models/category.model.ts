export interface Category {
  id: string;
  name: string;
  color: string; // Color hex para identificar visualmente la categoría
}

// Colores predeterminados para elegir al crear categoría
export const CATEGORY_COLORS = [
  '#6366f1', // Índigo
  '#f59e0b', // Ámbar
  '#10b981', // Esmeralda
  '#ef4444', // Rojo
  '#3b82f6', // Azul
  '#8b5cf6', // Violeta
  '#ec4899', // Rosa
  '#14b8a6', // Teal
];
