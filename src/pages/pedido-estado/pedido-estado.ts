import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';


@IonicPage()
@Component({
  selector: 'page-pedido-estado',
  templateUrl: 'pedido-estado.html',
})
export class PedidoEstadoPage {
      
  
  estados = []
  pedido_id  : string;

  constructor(public navCtrl: NavController
              , public toastCtrl: ToastController
              , public httpRequest : HttpRequestProvider
              , public loadingCtrl: LoadingController
              , public alertCtrl : AlertController
              , public navParams: NavParams
               
               ) {
            this.pedido_id = navParams.get("pedido_id");
            this.cargarPedido();
            console.log(this.estados)
  }

  ionViewDidLoad() {
    //this.cargarPedido();
  }

  cargarPedido(){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    try{
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getDetallePedido(token , this.pedido_id)).then((data : any) => {
        
        var response = data.json();
        console.log(response)
        if(response["STATUS"] != undefined  ||  response["STATUS"] != "OK" ){
          let paquete = response.PAQUETE;
          paquete.ESTADO.forEach(element => {
              this.estados.push({"nombre":element.NOMBRE , "descripcion": element.DESCRIPCION, "hora":element.HORA})
          });  
          console.log(this.estados)         
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

