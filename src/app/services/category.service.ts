import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly STORAGE_KEY = 'todo_categories';

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> =
    this.categoriesSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      // Si no hay datos, cargamos categorías de ejemplo para demo
      const categories: Category[] = raw ? JSON.parse(raw) : this.getDefaults();
      this.categoriesSubject.next(categories);
    } catch {
      this.categoriesSubject.next(this.getDefaults());
    }
  }

  // Categorías de ejemplo para que la app tenga datos desde el inicio
  private getDefaults(): Category[] {
    return [
      { id: '1', name: 'Personal', color: '#6366f1' },
      { id: '2', name: 'Trabajo', color: '#f59e0b' },
      { id: '3', name: 'Compras', color: '#10b981' },
    ];
  }

  private persist(categories: Category[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    this.categoriesSubject.next(categories);
  }

  private getAll(): Category[] {
    return this.categoriesSubject.getValue();
  }

  getById(id: string): Category | undefined {
    return this.getAll().find((c) => c.id === id);
  }

  addCategory(name: string, color: string): void {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: name.trim(),
      color,
    };
    this.persist([...this.getAll(), newCategory]);
  }

  updateCategory(id: string, changes: Partial<Category>): void {
    const updated = this.getAll().map((cat) =>
      cat.id === id ? { ...cat, ...changes } : cat,
    );
    this.persist(updated);
  }

  deleteCategory(id: string): void {
    this.persist(this.getAll().filter((cat) => cat.id !== id));
  }
}
