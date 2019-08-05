import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarritoPPage } from './carritoP';
import { ValoresPage } from '../valores/valores'

@NgModule({
  declarations: [
    CarritoPPage,
    ValoresPage,
  ],
  imports: [
    IonicPageModule.forChild(CarritoPPage),
  ],
})
export class CarritoPPageModule {}
