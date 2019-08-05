import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleComboPage } from './detalle-combo';

@NgModule({
  declarations: [
    DetalleComboPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleComboPage),
  ],
})
export class DetalleComboPageModule {}
