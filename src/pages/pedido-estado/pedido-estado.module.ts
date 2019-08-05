import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PedidoEstadoPage } from './pedido-estado';

@NgModule({
  declarations: [
    PedidoEstadoPage,
  ],
  imports: [
    IonicPageModule.forChild(PedidoEstadoPage),
  ],
})
export class PedidoEstadoPageModule {}
