import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, App } from 'ionic-angular';
import { HttpHeaders } from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';
import { ViewMapPage } from '../view-map/view-map';
import { SetUbicationPage } from '../set-ubication/set-ubication';

import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';

/**
 * Generated class for the ListUbicationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-ubication',
  templateUrl: 'list-ubication.html',
})
export class ListUbicationPage {

  public ubications = [];

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public Http: Http
    , public app: App
    , public httpRequest: HttpRequestProvider
    , public loadingCtrl: LoadingController
    , public alertCtrl: AlertController) {
    this.getUbications();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListUbicationPage');
  }

  getUbications() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present()
    var token = window.localStorage.getItem("userToken");
    try {
      console.log(Constantes.getListaDireccionesUrl(token))
      this.httpRequest.get(Constantes.getListaDireccionesUrl(token)).then((res: any) => {
        res = res.json();
        // let data = res.DIRECCIONES
        //  OTRA SOLUCION MAS MEJOR :v
        if (res.STATUS != 'OK') {
          console.log(res);
          loading.dismiss();
          this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
        } else {
          this.ubications = res["DIRECCIONES"];
          console.log(this.ubications);
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

  goToViewMap(ubication) {
    console.log("to map");
    this.navCtrl.push(ViewMapPage, {
      type: "view",
      data: ubication
    })
  }

  goToCobertura() {
      this.navCtrl.push(ViewMapPage, {
          type: 'cobertura',
          data: {
              NOMBRE: 'Cobertura',
              LATITUD: "-2.134636",
              LONGITUD: "-79.926739"
          }
      });
  }

  goToAddUbication() {
    this.navCtrl.push(ViewMapPage, {
      type: 'set',
      data: {
        NOMBRE: "Agregar Direccion",
        LATITUD: "-2.134636",
        LONGITUD: "-79.926739"
      }
    });
  }

}
