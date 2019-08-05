import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { InicioPage } from '../inicio/inicio';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HomePage } from '../home/home';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { DatosUsuario } from '../../interfaces/IDatosUsuario';
import { CameraOptions, Camera } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-registro-form',
  templateUrl: 'registro-form.html',
})
export class RegistroFormPage {

  validations_form: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  user : any;
  imagenPerfilBase64 : string;
  
  respuesta: any;

  datosUsuario: DatosUsuario = {
    apellidos : null,
    cedula : null,
    contrasena : "",
    correo : null,
    nombres : null,
    imagenUrl : null,
    telefono : null,
    token : null 
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public httpRequest : HttpRequestProvider,
              private toastCtrl: ToastController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public camera : Camera) {
    

    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    this.user =  Object.assign({}, this.navParams.data);
    if(this.user != null){
      this.datosUsuario.nombres = this.user.nombres;
      this.datosUsuario.apellidos = this.user.apellidos;
      this.datosUsuario.correo = this.user.correo;
    }
    this.validations_form = this.formBuilder.group({
      correo: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\\.[a-zA-Z]{2,4}'),
        Validators.required
      ])),
      nombres: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z_ ]+$'),
        Validators.required
      ])),
      apellidos: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z_ ]+$'),
        Validators.required
      ])),
      telefono:new FormControl('', Validators.compose([
        Validators.minLength(10),
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      cedula:new FormControl('', Validators.compose([
        Validators.minLength(10),
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      contrasena: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]+$')
      ])),

      });
      loading.dismiss();

  }

  hideShowPassword() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }


  validation_messages = {
    'correo': [
      { type: 'required', message: 'El Correo es obligatorio' },
      { type: 'pattern', message: 'No cumple con la estructura de un correo.' }
    ],
    'nombres': [
      { type: 'required', message: 'Los nombres son obligatorios' },
      { type: 'pattern', message: 'El nombre debe contener únicamente letras'}

    ],
    'apellidos': [
      { type: 'required', message: 'Los apellidos son obligatorios' },
      { type: 'pattern', message: 'El apellido debe contener únicamente letras'}

    ],

    'cedula': [
      { type: 'required', message: 'La cédula es obligatoria' },
      { type: 'minlength', message: 'La cédula debe contener 10 dígitos'},
      { type: 'pattern', message: 'La cédula debe contener únicamente números'}

    ],

    'telefono': [
      { type: 'required', message: 'El Teléfono es obligatorio.' },
      { type: 'minlength', message: 'El Teléfono debe contener 10 dígitos'},
      { type: 'pattern', message: 'El Teléfono debe contener únicamente números'}
    ],
    'contrasena': [
      { type: 'required', message: 'La contrasena es obligatoria' },
      { type: 'minlength', message: 'La contrasena debe tener minimo 5 caracteres' },
      { type: 'pattern', message: 'Su contrasena debe tener al menos una mayuscula, una minuscula y un numero.' }
    ],
  };


  abrirGaleria(){
    const opciones : CameraOptions = { 
       quality :  100,
       destinationType : this.camera.DestinationType.DATA_URL,
       encodingType: this.camera.EncodingType.JPEG,
       mediaType : this.camera.MediaType.PICTURE,
       sourceType : this.camera.PictureSourceType.PHOTOLIBRARY
     
    }
    this.camera.getPicture(opciones).then((imagen) => {
       this.imagenPerfilBase64 =  "data:image/jpeg;base64,"+imagen;
       this.datosUsuario.imagenUrl = "data:image/jpeg;base64,"+imagen;
    },(err) =>{
    }
    );
  }
  
  onSubmit(values){
    var datos = {
      "CORREO" : "",
      "CONTRASENA" : "",
      "NOMBRES" : "",
      "APELLIDOS" : "",
      "CEDULA" : "",
      "TELEFONO" : "",
      "IMAGEN" : ""
    };

    
    datos.CORREO = this.datosUsuario.correo;
    datos.APELLIDOS = this.datosUsuario.apellidos;
    datos.CONTRASENA = this.datosUsuario.contrasena;
    datos.NOMBRES = this.datosUsuario.nombres;
    datos.TELEFONO = this.datosUsuario.telefono;
    datos.CEDULA = this.datosUsuario.cedula;
    datos.IMAGEN =  this.datosUsuario.imagenUrl;
    
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    console.log(datos);
    this.httpRequest.post(Constantes.getRegistroFormUrl() , datos).then((res : any)=>{
      //localStorage.setItem('dataUsuario', JSON.stringif(this.respuesta));
      console.log(res);
      var resJ =  res.json();
      console.log(resJ);
      if (resJ.STATUS == "OK") {
        this.login();
      }else{
        this.mostrarMensaje("", "Algo ha salido mal, por favor intenta nuevamente");
      }
    }, (err)=>{
      /*Error*/
    });
    loading.dismiss();
  }

  login(){

    var datos = {
      "CORREO" : "",
      "CONTRASENA" : "",
      "NOMBRES" : "",
      "APELLIDOS" : "",
      "CEDULA" : "999999999",
      "TELEFONO" : ""
    };

    datos.CORREO = this.datosUsuario.correo;
    datos.APELLIDOS = this.datosUsuario.apellidos;
    datos.CONTRASENA = this.datosUsuario.contrasena;
    datos.NOMBRES = this.datosUsuario.nombres;
    datos.TELEFONO = this.datosUsuario.telefono;
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    this.httpRequest.post(Constantes.getLoginUrl() , datos).then((res : any)=>{
      console.log(res);
      var resJ = res.json();
      if (resJ.STATUS == "OK") {
        window.localStorage.setItem("userToken", resJ.TOKEN);
 
        this.navCtrl.setRoot(HomePage);
      }else{
        this.mostrarMensaje("", "Por favor, revise los datos");
      }
    }, (err)=>{
      //Mensaje de error
    });
    loading.dismiss();

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
          }
        }       
      ]
    });
    alert.present();
   }



}