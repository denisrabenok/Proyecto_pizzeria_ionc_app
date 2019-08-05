import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';

/**
 * Generated class for the PedidoDetallesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pedido-detalles',
  templateUrl: 'pedido-detalles.html',
})
export class PedidoDetallesPage {


  pizzas = []
  adicionales = []
  combos = []

  pedido_id : string;

  total : string ;

  constructor(public navCtrl: NavController
              , public toastCtrl: ToastController
              , public httpRequest : HttpRequestProvider
              , public loadingCtrl: LoadingController
              , public alertCtrl : AlertController
              , public navParams: NavParams) {

            this.pedido_id = navParams.get("pedido_id");
  }

  ionViewDidLoad() {
    this.cargarDetalles();
  }

  cargarDetalles(){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    try{
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getDetallePedido(token , this.pedido_id )).then((data : any) => {
        
        var response = data.json();
        console.log(response)
        if(response["STATUS"] != undefined  ||  response["STATUS"] != "OK" ){
          let paquete = response.PAQUETE;
         
          paquete.PIZZAS.forEach(element => {
              this.pizzas.push({"nombre":element.NOMBRE , "tamano": element.TAMANO, "cantidad":element.CANTIDAD})
          });
          paquete.ADICIONALES.forEach(element => {
              this.adicionales.push({"nombre":element.NOMBRE ,  "cantidad":element.CANTIDAD , "imagenUrl":element.IMAGEN_URL})
          });
          paquete.COMBOS.forEach(element => {
              this.combos.push({"nombre":element.NOMBRE ,  "cantidad":element.CANTIDAD , "imagenUrl":element.IMAGEN_URL})
          });

          this.total = paquete.TOTAL;
      
        }
        loading.dismiss();
        
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


  mostrarMensaje(titulo: string ,mensaje: string){
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop()
          }
        }   
      ]
    });
    alert.present();
    
   }

}