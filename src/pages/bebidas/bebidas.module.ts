import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BebidasPage } from './bebidas';

@NgModule({
  declarations: [
    BebidasPage,
  ],
  imports: [
    IonicPageModule.forChild(BebidasPage),
  ],
})
export class BebidasPageModule {}
