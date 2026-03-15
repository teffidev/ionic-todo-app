import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import { Category, CATEGORY_COLORS } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  host: { class: 'ion-page' },
  standalone: false,
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
  ) {}

  ngOnInit() {
    this.categoryService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cats) => {
        this.categories = cats;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByCategoryId(_i: number, cat: Category): string {
    return cat.id;
  }

  async openAddCategory() {
    await this.openCategoryForm();
  }

  async editCategory(category: Category) {
    await this.openCategoryForm(category);
  }

  private async openCategoryForm(existing?: Category) {
    const isEdit = !!existing;

    const alert = await this.alertCtrl.create({
      header: isEdit ? 'Editar Categoría' : 'Nueva Categoría',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: existing?.name || '',
          placeholder: 'Nombre de la categoría',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'alert-btn-cancel' },
        {
          text: isEdit ? 'Guardar' : 'Crear',
          cssClass: 'alert-btn-confirm',
          handler: (data) => {
            if (!data.name?.trim()) {
              this.showToast('Ingresa un nombre', 'warning');
              return false;
            }
            const color =
              existing?.color ||
              this.colors[Math.floor(Math.random() * this.colors.length)].value;
            if (isEdit && existing) {
              this.categoryService.updateCategory(existing.id, {
                name: data.name.trim(),
              });
              this.showToast('Categoría actualizada', 'primary');
            } else {
              this.categoryService.addCategory(data.name.trim(), color);
              this.showToast('Categoría creada', 'success');
            }
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteCategory(category: Category) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: `¿Eliminar "${category.name}"? Las tareas asignadas quedarán sin categoría.`,
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'alert-btn-cancel' },
        {
          text: 'Eliminar',
          cssClass: 'alert-btn-danger',
          handler: () => {
            this.taskService.removeCategory(category.id);
            this.categoryService.deleteCategory(category.id);
            this.showToast('Categoría eliminada', 'danger');
          },
        },
      ],
    });
    await alert.present();
  }

  async pickColor(category: Category) {
    const alert = await this.alertCtrl.create({
      header: 'Color de categoría',
      cssClass: 'custom-alert color-picker-alert',
      inputs: this.colors.map((color) => ({
        type: 'radio' as const,
        label: color.name,
        value: color.value,
        checked: category.color === color.value,
      })),
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'alert-btn-cancel' },
        {
          text: 'Aplicar',
          cssClass: 'alert-btn-confirm',
          handler: (color: string) => {
            if (color) {
              this.categoryService.updateCategory(category.id, { color });
              this.showToast('Color actualizado', 'primary');
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
      duration: 2200,
      position: 'top',
      color,
      cssClass: 'app-toast',
      icon: 'checkmark-circle-outline',
    });
    await toast.present();
  }
}
