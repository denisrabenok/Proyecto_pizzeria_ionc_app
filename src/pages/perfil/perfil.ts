import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { HttpHeaders} from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';

import { PerfilEditarPage}  from '../perfil-editar/perfil-editar';
import { HomePage } from '../home/home';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { DatosUsuario } from '../../interfaces/IDatosUsuario';



/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  datosUsuario: DatosUsuario = {
    apellidos : null,
    cedula : null,
    contrasena : "",
    correo : null,
    nombres : null,
    telefono : null,
    imagenUrl : null,
    token : null 
  }


  data : any;
  info : any;
  userId : string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public Http: Http,
    public httpRequest : HttpRequestProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public platform: Platform) {

      platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(HomePage)
      },2)

      if (window.localStorage.getItem("userToken") != null) {
          this.userId = window.localStorage.getItem("userToken");
      } else{
          this.navCtrl.setRoot(HomePage);
      }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

  ionViewWillEnter(){
    this.cargarDatos();
  }

  //npm install --save @angular/http
  //Imports en app.module
  cargarDatos(){
    var token = "";
    if(window.localStorage.getItem("userToken")!= null){
      token = window.localStorage.getItem("userToken");
      let loading = this.loadingCtrl .create({
        content: 'Cargando...'
      });
      loading.present();
      this.httpRequest.get(Constantes.getVerPefilUrl(token)).then((res : any)=>{
        this.info = res.json();
        console.log(res)
        if(this.info.STATUS == "OK"){
          this.datosUsuario.correo = this.info.CORREO;
          this.datosUsuario.nombres = this.info.NOMBRES;
          this.datosUsuario.apellidos = this.info.APELLIDOS;
          this.datosUsuario.cedula = this.info.CEDULA;
          this.datosUsuario.telefono = this.info.TELEFONO;
          this.datosUsuario.imagenUrl = this.info.IMAGEN
        }
        loading.dismiss();
      },(err)=>{
        loading.dismiss();
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
      });
    }

    
  }
   
  gotoEditarPefil(){
    this.navCtrl.push(PerfilEditarPage, {
      nombres: this.datosUsuario.nombres,
      apellidos: this.datosUsuario.apellidos,
      correo: this.datosUsuario.correo,
      cedula: this.datosUsuario.cedula,
      telefono: this.datosUsuario.telefono,
      imagenUrl : this.datosUsuario.imagenUrl
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