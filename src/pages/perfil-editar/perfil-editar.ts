import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DatosUsuario } from '../../interfaces/IDatosUsuario';
import { Constantes } from '../../util/constantes';
import { Camera, CameraOptions} from "@ionic-native/camera";
import { PerfilPage } from '../perfil/perfil';


@IonicPage()
@Component({
  selector: 'page-perfil-editar',
  templateUrl: 'perfil-editar.html',
})
export class PerfilEditarPage {

  imagenPerfilBase64 : string;
  imagenPerfilUrl : string;
  validations_form: FormGroup;
  apellidos : string;
  nombres : string;
  cedula : string;
  correo : string;
  telefono : string;
  imagenUrl: string;
  token : string;

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
    ],


  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public Http: Http ,
              public httpRequest : HttpRequestProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public camera : Camera,
              public platform: Platform) {
        
              platform.registerBackButtonAction(() => {
                this.navCtrl.setRoot(PerfilPage)
              },2)
  

            let loading = this.loadingCtrl .create({
              content: 'Cargando...'
            });
            loading.present();


           /* this.datosUsuario.correo = navParams.get("correo");
            this.datosUsuario.nombres = navParams.get("nombres");
            this.datosUsuario.apellidos = navParams.get("apellidos");
            this.datosUsuario.cedula = navParams.get("cedula");
            this.datosUsuario.telefono = navParams.get("telefono");
            this.datosUsuario.imagenUrl = navParams.get("imagenUrl");
            if (window.localStorage.getItem("userToken") != null) {
              this.datosUsuario.token = window.localStorage.getItem("userToken");
            }*/

            this.datosUsuario.correo = navParams.get("correo");
            this.datosUsuario.nombres = navParams.get("nombres");
            this.datosUsuario.apellidos = navParams.get("apellidos");
            this.datosUsuario.cedula = navParams.get("cedula");
            this.datosUsuario.telefono = navParams.get("telefono");
            this.datosUsuario.imagenUrl = navParams.get("imagenUrl");
            if (window.localStorage.getItem("userToken") != null) {
              this.datosUsuario.token = window.localStorage.getItem("userToken");
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
              cedula: new FormControl('', Validators.compose([
                Validators.minLength(10),
                Validators.required,
                Validators.pattern('^[0-9]*$')
              ])),

              });
              loading.dismiss();
  }

  /**
   *
   */
  guardarPerfil(){
    console.log(this.datosUsuario);
  /** var datos =  {
      "CORREO" : "",
      "CONTRASENA" : "",
      "NOMBRES" : "",
      "APELLIDOS" : "",
      "CEDULA" : "",
      "TELEFONO" : "",
      "TOKEN": ""
    };

    datos.CORREO =     this.datosUsuario.correo;
    datos.APELLIDOS =  this.datosUsuario.apellidos;
    datos.CEDULA =     this.datosUsuario.cedula;
    datos.CONTRASENA = this.datosUsuario.contrasena;
    datos.NOMBRES =    this.datosUsuario.nombres;
    datos.TELEFONO =    this.datosUsuario.telefono;
    datos.TOKEN =      this.datosUsuario.token;
**/
  


    let postData  = new FormData();
    if(this.nombres != null){
      postData.append("NOMBRES",   this.nombres);
    } else {
      postData.append("NOMBRES",   this.datosUsuario.nombres);
    }

    if(this.apellidos != null){
      postData.append("APELLIDOS",   this.apellidos);
    } else {
      postData.append("APELLIDOS", this.datosUsuario.apellidos);
    }

    if(this.correo != null){
      postData.append("CORREO",   this.correo);
    } else {
      postData.append("CORREO",    this.datosUsuario.correo);
    } 

    if(this.cedula != null){
      postData.append("CEDULA",   this.cedula);
    } else {
      postData.append("CEDULA",    this.datosUsuario.cedula);
    }
    
    if(this.telefono != null){
      postData.append("TELEFONO",   this.telefono);
    } else {
      postData.append("TELEFONO",   this.datosUsuario.telefono);
    }
    
    postData.append("TOKEN",     this.datosUsuario.token);

    if(this.imagenPerfilBase64 != null){ 
      console.log("imagen  detectada")
      postData.append("IMAGEN", this.imagenPerfilBase64);
    }
    else {
      postData.append("IMAGEN", this.datosUsuario.imagenUrl);
    }
    console.log(postData)
      /*
    let regexp_telefono = new RegExp('^09[0-9]{8}$');
    let test_telefono = regexp_telefono.test(datos.TELEFONO);
    let regexp_correo = new RegExp('^\w+@\w+\.[a-z]+$');
    let regexp_correo = new RegExp('^\w+@\w+\.[a-z]{2,4}$');
    let test_correo = regexp_correo.test(datos.CORREO);
    console.log(test_correo);
    */
    let loading = this.loadingCtrl .create({
    content: 'Cargando...'
    });
    loading.present(); 
    //let data : Observable<any> =this.Http.post(Constantes.getEditarPerfilUrl() , postData);
    //data.subscribe((result)=>{
    //  loading.dismiss();
    //  console.log(result)
    //})\
    console.log(postData);
     this.httpRequest.post(Constantes.getEditarPerfilUrl(), postData).then((res : any)=>{
       var data = res.json();
       loading.dismiss();
       console.log(data);
       if(data.STATUS == "OK"){
         this.navCtrl.pop();
       }else{
         this.mostrarMensaje("", Constantes.ALGO_HA_SALIDO_MAL);
       }
     }, (err)=>{
       loading.dismiss();
      // this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
       this.mostrarMensaje("error",err);
     });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilEditarPage');
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
            this.navCtrl.setRoot(PerfilPage);
          }
        }
      ]
    });
    alert.present();

   }

   abrirGaleria(){
     const opciones : CameraOptions = { 
        quality :  100,
        destinationType : this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType : this.camera.MediaType.PICTURE,
        sourceType : this.camera.PictureSourceType.PHOTOLIBRARY
     }
     this.camera.getPicture(opciones).then((imagen) => {
       console.log("imagen get picture")
        this.imagenPerfilBase64 =  "data:image/jpeg;base64,"+imagen
     },(err) =>{
     }
     );
   }




}
