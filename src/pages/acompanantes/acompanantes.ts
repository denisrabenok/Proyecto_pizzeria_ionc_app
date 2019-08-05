import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, AlertController, App } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Adicional } from "../../interfaces/IAdicional";
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';

/**
 * Generated class for the AcompanantesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-acompanantes',
  templateUrl: 'acompanantes.html',
})
export class AcompanantesPage {

  adicionales : Array<Adicional>

  constructor(public navCtrl: NavController,
              public navParams: NavParams
            , public httpRequest : HttpRequestProvider
            , public events: Events
            , public loadingCtrl: LoadingController
            , public alertCtrl : AlertController
            , public app: App) {
  }

  ionViewDidLoad() {
    this.cargarAdicionals();
  
  }

  disminuirCantidad(adicional) {
    
    adicional.cantidad--;
    this.handlerCheckbox(adicional);
  }

  aumentarCantidad(adicional) {
    adicional.cantidad++;
    this.handlerCheckbox(adicional);
  }



  cargarAdicionals(){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    this.adicionales = new Array<Adicional>();
    let token = window.localStorage.getItem("userToken");
    try{
      this.httpRequest.get(Constantes.getAdicionalesUrl(token, "ADICIONAL")).then((data : any) => {
        var response = data.json();
        response['ADICIONALES'].forEach((child : any) => {
        let adicional : Adicional ={
          id : child.ID,
          nombre:child.NOMBRE,
          costoBase : child.COSTO,
          imagenUrl : child.IMAGEN_URL,
          checked : false,
          cantidad : 1
        }
        this.adicionales.push(adicional);
        });
        loading.dismiss();
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
   * Este metodo procesara la accion de seleccionar un adicional
   * @param adicional bebid que captura el evento del checkbox
   */
  handlerCheckbox(adicional){
    this.events.publish('seleccion-adicional', adicional );
  }

}
