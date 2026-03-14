import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import { Category, CATEGORY_COLORS } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.page.html',
  styleUrls: ['categories.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage implements OnInit, OnDestroy {
  categories: Category[] = [];
  colors = CATEGORY_COLORS;

  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.categoryService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cats) => {
        this.categories = cats;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByCategoryId(_i: number, cat: Category): string {
    return cat.id;
  }

  // ── AGREGAR ───────────────────────────────────
  async openAddCategory() {
    await this.openCategoryForm();
  }

  // ── EDITAR ────────────────────────────────────
  async editCategory(category: Category) {
    await this.openCategoryForm(category);
  }

  // Reutilizamos el mismo formulario para crear y editar
  private async openCategoryForm(existing?: Category) {
    const isEdit = !!existing;
    let selectedColor = existing?.color || this.colors[0];

    const alert = await this.alertCtrl.create({
      header: isEdit ? '✏️ Editar Categoría' : '🏷️ Nueva Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: existing?.name || '',
          placeholder: 'Nombre de la categoría',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: isEdit ? 'Guardar' : 'Crear',
          handler: (data) => {
            if (!data.name?.trim()) {
              this.showToast('Ingresa un nombre', 'warning');
              return false;
            }
            if (isEdit && existing) {
              this.categoryService.updateCategory(existing.id, {
                name: data.name.trim(),
                color: selectedColor,
              });
              this.showToast('Categoría actualizada');
            } else {
              this.categoryService.addCategory(data.name.trim(), selectedColor);
              this.showToast('Categoría creada ✓');
            }
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  // ── ELIMINAR ──────────────────────────────────
  async deleteCategory(category: Category) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Categoría',
      message: `¿Eliminar "${category.name}"? Las tareas asignadas quedarán sin categoría.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            // Primero limpiamos las tareas que tenían esta categoría
            this.taskService.removeCategory(category.id);
            this.categoryService.deleteCategory(category.id);
            this.showToast('Categoría eliminada');
          },
        },
      ],
    });
    await alert.present();
  }

  // ── COLOR PICKER ──────────────────────────────
  async pickColor(category: Category) {
    const inputs = this.colors.map((color, i) => ({
      type: 'radio' as const,
      label: color,
      value: color,
      checked: category.color === color,
    }));

    const alert = await this.alertCtrl.create({
      header: 'Elegir Color',
      cssClass: 'color-picker-alert',
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aplicar',
          handler: (color: string) => {
            if (color) {
              this.categoryService.updateCategory(category.id, { color });
            }
          },
        },
      ],
    });
    await alert.present();
  }

  private async showToast(message: string, color = 'dark') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1800,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
