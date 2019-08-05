import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, AlertController, App } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Adicional } from "../../interfaces/IAdicional";
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';

/**
 * Generated class for the BebidasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bebidas',
  templateUrl: 'bebidas.html',
})
export class BebidasPage {

  bebidas : Array<Adicional>

  constructor(public navCtrl: NavController,
              public navParams: NavParams
            , public httpRequest : HttpRequestProvider
            , public events: Events
            , public loadingCtrl: LoadingController
            , public alertCtrl : AlertController
            , public app : App) {
  }

  ionViewDidLoad() {
    this.cargarBebidas();
  
  }

  disminuirCantidad(bebida) {
    
    bebida.cantidad--;
    this.handlerCheckbox(bebida);
  }

  aumentarCantidad(bebida) {
    bebida.cantidad++;
    this.handlerCheckbox(bebida);
  }


  cargarBebidas(){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    try{
      this.bebidas = new Array<Adicional>();
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getAdicionalesUrl(token , "BEBIDA")).then((data : any) => {
        var response = data.json();
        if( response['ADICIONALES'] != undefined){
          response['ADICIONALES'].forEach((child : any) => {
            let bebida : Adicional ={
              id : child.ID,
              nombre:child.NOMBRE,
              costoBase : child.COSTO,
              imagenUrl : child.IMAGEN_URL,
              checked : false,
              cantidad : 1
            }
            this.bebidas.push(bebida);
          });
          loading.dismiss();
        }else{
          loading.dismiss();
          if(response["STATUS"] != 'OK'){
            this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
          }
        }
        
      }, (err)=>{
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
            this.app.getRootNavs()[0].setRoot(HomePage)
          }
        }
     
        
      ]
    });
    alert.present();
    
   }
  
    

  /**
   * Este metodo procesara la accion de seleccionar un bebida
   * @param bebida bebid que captura el evento del checkbox
   */
  handlerCheckbox(bebida){
    this.events.publish('seleccion-adicional', bebida );
  }

}
