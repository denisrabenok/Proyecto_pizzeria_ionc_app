import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, App } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { ListUbicationPage } from '../list-ubication/list-ubication';

/**
 * Generated class for the SetUbicationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-set-ubication',
  templateUrl: 'set-ubication.html',
})
export class SetUbicationPage {

  latitud: any;
  longitud: any;
  validations_form: FormGroup;
  dataDireccion = {
    "TOKEN": "",
    "NOMBRE": "",
    "DESCRIPCION": "",
    "LATITUD": 0,
    "LONGITUD": 0
  }

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public Http: Http
    , public app: App
    , public httpRequest: HttpRequestProvider
    , public loadingCtrl: LoadingController
    , public alertCtrl: AlertController
    , public formBuilder: FormBuilder, ) {
    let data = navParams.get('data');
    var token = window.localStorage.getItem("userToken");
    this.dataDireccion.TOKEN = token;
    this.dataDireccion.LATITUD = +data['lat'];
    this.dataDireccion.LONGITUD = +data['lng'];
    this.validations_form = this.formBuilder.group({
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
      latitud: new FormControl(this.latitud),
      longitud: new FormControl(this.longitud),
    })
  }

  ionViewDidLoad() {
    console.log('Set ubication page');
  }

  validation_messages = {
    'nombre': [
      { type: 'required', message: 'Nombre de la direccion es obligatorio' }
    ]
  }

  onSubmit(values) {
    console.log(this.dataDireccion);
    this.guardarDireccion();
  }

  guardarDireccion() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present()
    var token = window.localStorage.getItem("userToken");
    try {
      this.httpRequest.post(Constantes.postCrearDireccionUrl(), this.dataDireccion).then((res: any) => {
        res = res.json();
        if (res.STATUS != 'OK') {
          console.log(res);
          loading.dismiss();
          this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
        } else {
          //this.navCtrl.push(ListUbicationPage);
          this.navCtrl.setRoot(ListUbicationPage);
          loading.dismiss();
        }
      });
    } catch (err) {
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }
  }

  mostrarMensaje(titulo: string, mensaje: string) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          /*handler: () => {
            this.app.getRootNavs()[0].setRoot(HomePage)
        }*/
        }
      ]
    });
    alert.present();
  }

}
