import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrearPizzaPage } from './crear-pizza';

@NgModule({
  declarations: [
    CrearPizzaPage,
  ],
  imports: [
    IonicPageModule.forChild(CrearPizzaPage),
  ],
})
export class CrearPizzaPageModule {}
