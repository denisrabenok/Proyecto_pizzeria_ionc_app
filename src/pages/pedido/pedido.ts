import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { PedidoDetallesPage } from '../pedido-detalles/pedido-detalles';
import { PedidoEstadoPage } from '../pedido-estado/pedido-estado';

/**
 * Generated class for the PedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pedido',
  templateUrl: 'pedido.html',
})
export class PedidoPage {

  /*   Tabs  */
  estadoTab = PedidoEstadoPage;
  detallesTab = PedidoDetallesPage;

  estadoParams = {};
  detallesParams = {};

  pedido_id : string;
  pedido_fecha : string;
  

  constructor(public navCtrl: NavController
              , public navParams: NavParams
               
               ) {
    this.pedido_id = navParams.get("pedido_id");
    this.pedido_fecha = navParams.get("pedido_fecha");
    this.estadoParams["pedido_id"] = this.pedido_id;
    this.detallesParams["pedido_id"] = this.pedido_id;
  }

  ionViewDidLoad() {
    //this.cargarPedido();
  }

  



}
