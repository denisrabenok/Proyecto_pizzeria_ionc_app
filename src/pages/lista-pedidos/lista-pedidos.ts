import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TrackingPizzaPage } from '../tracking-pizza/tracking-pizza';
import { Pedido } from '../../interfaces/IPedido';
import { PedidoPage } from '../pedido/pedido';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';
import { SalaChatPage } from '../sala-chat/sala-chat';

/**
 * Generated class for the ListaPedidosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-pedidos',
  templateUrl: 'lista-pedidos.html',
})
export class ListaPedidosPage {

  pedidos  : Array<Pedido>;


  constructor(public navCtrl: NavController
            , public toastCtrl: ToastController
            , public httpRequest : HttpRequestProvider
            , public events: Events
            , public loadingCtrl: LoadingController
            , public alertCtrl : AlertController
            , public navParams: NavParams
            ) {
    this.pedidos = new Array<Pedido>();
 
   
  }

  ionViewDidLoad() {
    this.cargarPedidos();
    console.log('ionViewDidLoad ListaPedidosPage');
  }

  cargarPedidos(){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    try{
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getPedidos(token)).then((data : any) => {
        
        var response = data.json();
        console.log(response)
        if(response["STATUS"] != undefined  ||  response["STATUS"] != "OK" ){
          let pedidos = response.PEDIDOS;
          pedidos.forEach((elemento :any) => {
            let pedido : Pedido ={
              id : elemento.ID,
              fecha : elemento.FECHA,
              estado : elemento.ESTADO,
              recibido : elemento.RECIBIDO
             
            }
            this.pedidos.push(pedido);
            
          });
          this.pedidos.reverse();
          loading.dismiss();

  
        }
        
      }, (err)=>{
        loading.dismiss();
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
      });
    }
    catch(err) {
      loading.dismiss();
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }
  }

  verPedido(pedido){
    this.navCtrl.push(PedidoPage, {
        pedido_id : pedido.id,
        pedido_fecha : pedido.fecha
    });
  }

  salaChat(pedido){
    this.navCtrl.push(SalaChatPage, {
      key : pedido.id,
      nickname : window.localStorage.getItem("userToken")
  });
  }



  mostrarMensaje(titulo: string ,mensaje: string){
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            this.navCtrl.setRoot(HomePage)
          }
        }
     
        
      ]
    });
    alert.present();
    
   }

}
