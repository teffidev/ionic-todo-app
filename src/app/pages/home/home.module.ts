import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // *ngIf, *ngFor, etc.
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: HomePage }]), // Ruta hija
  ],
  declarations: [HomePage], // Declarar el componente en este módulo
})
export class HomePageModule {}
