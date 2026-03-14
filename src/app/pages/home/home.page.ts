import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import {
  AlertController,
  ToastController,
  IonItemSliding,
  NavController,
} from '@ionic/angular';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { RemoteConfigService } from '../../services/remote-config.service';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  categories: Category[] = [];
  selectedCategoryId: string | null = null;
  showCategoryFilter = true;

  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private remoteConfigService: RemoteConfigService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController,
  ) {}

  async ngOnInit() {
    await this.remoteConfigService.initialize();
    this.showCategoryFilter = this.remoteConfigService.getBoolean(
      'show_category_filter',
    );

    combineLatest([this.taskService.tasks$, this.categoryService.categories$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([tasks, categories]) => {
        this.tasks = tasks;
        this.categories = categories;
        this.applyFilter();
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ionViewWillEnter se dispara cada vez que Ionic muestra esta página,
  // incluso al volver desde categorías. Con OnPush, markForCheck() es
  // necesario para que Angular re-evalúe el template en ese momento.
  ionViewWillEnter() {
    this.cdr.markForCheck();
  }

  // NavController.navigateForward activa las animaciones de Ionic.
  // Router.navigate() solo cambia la URL sin disparar ion-router-outlet.
  goToCategories() {
    this.navCtrl.navigateForward('/categories');
  }

  // ── Filtrado ─────────────────────────────────────────────────
  selectCategory(categoryId: string | null) {
    this.selectedCategoryId = categoryId;
    this.applyFilter();
    this.cdr.markForCheck();
  }

  private applyFilter() {
    this.filteredTasks = this.selectedCategoryId
      ? this.tasks.filter((t) => t.categoryId === this.selectedCategoryId)
      : [...this.tasks];
  }

  trackById(_index: number, item: { id: string }): string {
    return item.id;
  }

  getCategoryForTask(task: Task): Category | undefined {
    return this.categories.find((c) => c.id === task.categoryId);
  }

  get pendingCount(): number {
    return this.tasks.filter((t) => !t.completed).length;
  }

  // ── Agregar tarea ─────────────────────────────────────────────
  async openAddTaskAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Tarea',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: '¿Qué necesitas hacer?',
          attributes: { autofocus: true },
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'alert-btn-cancel' },
        {
          text: 'Siguiente',
          cssClass: 'alert-btn-confirm',
          handler: async (data) => {
            if (!data.title?.trim()) {
              this.showToast('Escribe el nombre de la tarea', 'warning');
              return false;
            }
            await this.selectCategoryForNewTask(data.title.trim());
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  private async selectCategoryForNewTask(title: string) {
    const alert = await this.alertCtrl.create({
      header: 'Elegir Categoría',
      cssClass: 'custom-alert',
      inputs: [
        { type: 'radio', label: 'Sin categoría', value: '', checked: true },
        ...this.categories.map((cat) => ({
          type: 'radio' as const,
          label: cat.name,
          value: cat.id,
        })),
      ],
      buttons: [
        { text: 'Atrás', role: 'cancel', cssClass: 'alert-btn-cancel' },
        {
          text: 'Agregar',
          cssClass: 'alert-btn-confirm',
          handler: (categoryId: string) => {
            this.taskService.addTask(title, categoryId || null);
            this.showToast('Tarea agregada');
          },
        },
      ],
    });
    await alert.present();
  }

  // ── Editar tarea ──────────────────────────────────────────────
  async editTask(task: Task, slidingItem?: IonItemSliding) {
    await slidingItem?.close();
    const alert = await this.alertCtrl.create({
      header: 'Editar Tarea',
      cssClass: 'custom-alert',
      inputs: [{ name: 'title', type: 'text', value: task.title }],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'alert-btn-cancel' },
        {
          text: 'Guardar',
          cssClass: 'alert-btn-confirm',
          handler: (data) => {
            if (data.title?.trim()) {
              this.taskService.updateTask(task.id, {
                title: data.title.trim(),
              });
              this.showToast('Tarea actualizada');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  // ── Toggle / Delete ───────────────────────────────────────────
  toggleTask(task: Task) {
    this.taskService.toggleComplete(task.id);
  }

  async deleteTask(task: Task, slidingItem?: IonItemSliding) {
    await slidingItem?.close();
    this.taskService.deleteTask(task.id);
    this.showToast('Tarea eliminada');
  }

  private async showToast(message: string, color = 'dark') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1800,
      position: 'bottom',
      color,
      cssClass: 'app-toast',
    });
    await toast.present();
  }
}
