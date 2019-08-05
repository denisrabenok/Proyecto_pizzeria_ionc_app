import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallePromocionalPage } from './detalle-promocional';

@NgModule({
  declarations: [
    DetallePromocionalPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallePromocionalPage),
  ],
})
export class DetallePromocionalPageModule {}
