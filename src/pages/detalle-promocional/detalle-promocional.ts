import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, AlertController, Platform, Events, ToastController, ViewController } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';
import { PizzaUnoPage } from '../pizza-uno/pizza-uno';
import { PromoMarViePage } from '../promo-mar-vie/promo-mar-vie';

@IonicPage()
@Component({
  selector: 'page-detalle-promocional',
  templateUrl: 'detalle-promocional.html',
})
export class DetallePromocionalPage {

  public combos = [];
  public combosTemp = [];

  constructor(
          public navCtrl: NavController,
          public navParams: NavParams,
          public app: App,
          public httpRequest: HttpRequestProvider,
          public loadingCtrl: LoadingController,
          public alertCtrl: AlertController,
          public platform: Platform,
          public events: Events,
          public toastCtrl: ToastController,
          private viewCtrl : ViewController
  ) {
    this.getLocalCombos();
  }

  ionViewDidLoad() {
    let combo = this.navParams.get("combo");
    console.log(combo);   
  }

  getLocalCombos() {
    var token = window.localStorage.getItem("userToken");
    try {
      console.log(Constantes.getPromocionalesUrl(token))
      this.httpRequest.get(Constantes.getPromocionalesUrl(token)).then((res: any) => {
        res = res.json();
        let data = res.COMBOS;
        console.log(data)
        let combos = (this.navParams.get("combo"));
        console.log(combos.ID)
        for (var i in Object.keys(data)) {
          if (Object.keys(data)[i] == combos.ID) {
            for (var j in data) {
              if (data[j].ID == combos.ID) {
                this.combos.push(data[j])
              }
            }
          }
        }
      }, (error: any) => {
        this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
      });
    } catch (err) {
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }
  }

  ordenar() {
    let nombre = this.navParams.get("promo");
    let costo = this.navParams.get("costo");
    let combo = this.navParams.get("combo");
    let combosNav = this.navParams.get("combos"); 
    

    if(nombre =='Martes 2x1'){
      this.abrirVentanaPromo(nombre, costo, combo);
      this.viewCtrl.dismiss();
    }
    if(nombre =='Miercoles Tripleta'){
      this.abrirVentanaUno(nombre, costo, combo);
      this.viewCtrl.dismiss();
    } 
    else if(nombre =='Jueves Sorpresa') {
      this.abrirVentanaUno(nombre, costo, combo);
      this.viewCtrl.dismiss();
    }
    else if(nombre =='Sabado Tetra') {
      this.abrirVentanaUno(nombre, costo, combo);
      this.viewCtrl.dismiss();
    }
    else if(nombre =='Ultra Pack Dominguero') {
      this.abrirVentanaUno(nombre, costo, combo);
      this.viewCtrl.dismiss();
    }
  }

  abrirVentanaUno(promo, costo, combo){
    let combosNav = this.navParams.get("combos"); 
    console.log(combosNav)
    this.navCtrl.push(PizzaUnoPage, {
      combos : combosNav,
      costo : costo,
      promo : promo,
      combo : combo, 
    })
  }

  abrirVentanaPromo(promo, costo, combo){
    let combosNav = this.navParams.get("combos"); 
    console.log(combosNav)
    this.navCtrl.push(PromoMarViePage, {
      combos : combosNav,
      costo : costo,
      promo : promo,
      combo : combo, 
    })
  }



  mostrarMensaje(titulo: string, mensaje: string) {
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

  cerrarModal(){
    this.viewCtrl.dismiss();
  }
}
