import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarteraTarjetasPage } from './cartera-tarjetas';

@NgModule({
  declarations: [
    CarteraTarjetasPage,
  ],
  imports: [
    IonicPageModule.forChild(CarteraTarjetasPage),
  ],
})
export class CarteraTarjetasPageModule {}
