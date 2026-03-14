import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CategoriesPage } from './categories.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: CategoriesPage }]),
  ],
  declarations: [CategoriesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoriesPageModule {}
