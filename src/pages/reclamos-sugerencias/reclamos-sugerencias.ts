import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { PerfilPage } from '../perfil/perfil';
import { Constantes } from '../../util/constantes';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { HomePage } from '../home/home';
import { Token } from '@angular/compiler';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';

/**
 * Generated class for the ReclamosSugerenciasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reclamos-sugerencias',
  templateUrl: 'reclamos-sugerencias.html',
}) 
export class ReclamosSugerenciasPage {

  rosTexto: String;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public httpRequest : HttpRequestProvider,
    ) {
      let loading = this.loadingCtrl .create({
        content: 'Cargando...'
        });
        loading.present(); 
        loading.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReclamosSugerenciasPage');
  }

  enviar(){

    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
      });
      loading.present(); 
      if(window.localStorage.getItem("userToken") != null){

        var postData = {
          "TOKEN": "",
          "CONTENIDO": "",
          "FECHA": ""
        };

        var fecha = new Date().toJSON().split('T');
        console.log(fecha);
        postData.TOKEN = window.localStorage.getItem("userToken");
        postData.CONTENIDO = this.rosTexto.toString();
        postData.FECHA = fecha[0] + " " + fecha[1];
        
        console.log(postData);
        this.httpRequest.post(Constantes.RECLAMOS_SUGERENCIAS, postData).then((res : any)=>{
          var data = res.json();
          loading.dismiss();
          console.log(data);
          if(data.STATUS == "OK"){
            this.mostrarMensaje("",Constantes.RECLAMO_EXITOSO);
            this.navCtrl.setRoot(HomePage);
          }else{
            this.mostrarMensaje("", Constantes.ALGO_HA_SALIDO_MAL);
          }
        }, (err)=>{
          loading.dismiss();
         // this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
          this.mostrarMensaje("error",err);
        });
      }else{
        loading.dismiss();
        this.mostrarMensaje("", Constantes.ALGO_HA_SALIDO_MAL);
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
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();

   }



}
