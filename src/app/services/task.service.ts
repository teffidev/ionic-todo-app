import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root', // Disponible en toda la app (singleton global)
})
export class TaskService {
  private readonly STORAGE_KEY = 'todo_tasks';

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  // ── CARGA INICIAL ──────────────────────────────
  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      const tasks: Task[] = raw ? JSON.parse(raw) : [];
      this.tasksSubject.next(tasks);
    } catch {
      this.tasksSubject.next([]);
    }
  }

  // ── PERSISTENCIA ──────────────────────────────
  // Cada vez que cambia el estado, guardamos en localStorage
  // Y notificamos a todos los suscriptores (componentes).
  private persist(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  // ── HELPERS ───────────────────────────────────
  private getAll(): Task[] {
    return this.tasksSubject.getValue();
  }

  // ── CRUD ──────────────────────────────────────
  addTask(title: string, categoryId: string | null = null): void {
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      categoryId,
      createdAt: new Date().toISOString(),
    };
    this.persist([...this.getAll(), newTask]);
  }

  toggleComplete(id: string): void {
    const updated = this.getAll().map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    this.persist(updated);
  }

  updateTask(id: string, changes: Partial<Task>): void {
    const updated = this.getAll().map((task) =>
      task.id === id ? { ...task, ...changes } : task,
    );
    this.persist(updated);
  }

  deleteTask(id: string): void {
    this.persist(this.getAll().filter((task) => task.id !== id));
  }

  // Cuando se elimina una categoría, removemos la asignación de las tareas
  removeCategory(categoryId: string): void {
    const updated = this.getAll().map((task) =>
      task.categoryId === categoryId ? { ...task, categoryId: null } : task,
    );
    this.persist(updated);
  }
}
