import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IngredientesPage } from './ingredientes';

@NgModule({
  declarations: [
    IngredientesPage,
  ],
  imports: [
    IonicPageModule.forChild(IngredientesPage),
  ],
})
export class IngredientesPageModule {}
