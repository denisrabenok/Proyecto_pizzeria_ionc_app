import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IngredientesPromoPage } from './ingredientes-promo';

@NgModule({
  declarations: [
    IngredientesPromoPage,
  ],
  imports: [
    IonicPageModule.forChild(IngredientesPromoPage),
  ],
})
export class IngredientesPromoPageModule {}
