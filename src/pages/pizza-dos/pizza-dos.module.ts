import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PizzaDosPage } from './pizza-dos';

@NgModule({
  declarations: [
    PizzaDosPage,
  ],
  imports: [
    IonicPageModule.forChild(PizzaDosPage),
  ],
})
export class PizzaDosPageModule {}
