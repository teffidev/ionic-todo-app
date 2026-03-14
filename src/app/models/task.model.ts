export interface Task {
  id: string; // Identificador único (usamos timestamp como string)
  title: string; // Texto de la tarea
  completed: boolean; // Estado: completada o pendiente
  categoryId: string | null; // Puede no tener categoría (null)
  createdAt: string; // Fecha como string para serializar en localStorage
}
