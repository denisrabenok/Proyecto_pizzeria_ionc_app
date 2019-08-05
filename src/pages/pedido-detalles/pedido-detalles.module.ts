import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PedidoDetallesPage } from './pedido-detalles';

@NgModule({
  declarations: [
    PedidoDetallesPage,
  ],
  imports: [
    IonicPageModule.forChild(PedidoDetallesPage),
  ],
})
export class PedidoDetallesPageModule {}
