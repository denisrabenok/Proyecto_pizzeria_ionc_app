import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, App, Platform, Events, ModalController } from 'ionic-angular';
import { Http} from '@angular/http';
import { DetalleComboPage } from '../detalle-combo/detalle-combo';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';
import { CombinacionesPage } from '../combinaciones/combinaciones';
import { DetallePromocionalPage } from '../detalle-promocional/detalle-promocional';

@IonicPage()
@Component({
  selector: 'page-combo',
  templateUrl: 'combo.html',
})
export class ComboPage {

  public combos = [];
  public pizzaCombo = [];
  public objetivo : string;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public Http: Http, 
              public app: App, 
              public httpRequest : HttpRequestProvider, 
              public loadingCtrl: LoadingController, 
              public alertCtrl : AlertController,
              public platform: Platform, 
              public events : Events,
              public modalCtrl: ModalController) {
      platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(HomePage)
      },2)
    this.getLocalCombos();
    this.objetivo = navParams.get("objetivo");
    }

  getLocalCombos() {
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present()
    var token =  window.localStorage.getItem("userToken");
    try{
      console.log(Constantes.getPromocionalesUrl(token))
      this.httpRequest.get(Constantes.getPromocionalesUrl(token)).then( (res: any) => {
          res = res.json();
          let data = res.COMBOS;
          if(data != null){
            console.log(Object.keys(data));
            this.combos = Object.keys(data).map(function(index) {
              let promo = data[index];
              return promo;
            });
            console.log(this.combos);
            // this.promociones = res.COMBOS;
            // console.log(this.promociones);
          }else{
            if(data.STATUS != 'OK'){
              this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
            }
          }
          loading.dismiss();
        }, (error : any)=>{
          console.log("Error")
          loading.dismiss();
          this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
        });
    }catch(err) {
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

  detalle(combo) {
    this.navCtrl.push(DetalleComboPage, {
      data: combo
    })
  }

  promoMartes() {
    this.abrirVentanaDetalle(this.combos[0].NOMBRE, this.combos[0].COSTO, this.combos[0]);
  }
  promoMiercoles() {
    this.abrirVentanaDetalle(this.combos[1].NOMBRE, this.combos[1].COSTO, this.combos[1]);
  }
  promoJueves() {
    this.abrirVentanaDetalle(this.combos[2].NOMBRE, this.combos[2].COSTO, this.combos[2]);
  }
  
  promoSabado() {
    this.abrirVentanaDetalle(this.combos[3].NOMBRE, this.combos[3].COSTO, this.combos[3]);
  }
  promoDomingo() {
    this.abrirVentanaDetalle(this.combos[4].NOMBRE, this.combos[4].COSTO, this.combos[4]);
  }

  crear(nombre, costo, combo) {
    this.abrirVentanaDetalle(nombre, costo, combo);
  }


  abrirVentanaDetalle(promo, costo, combo){
    let comboTemp = {"ID":combo.ID ,"NOMBRE" :combo.NOMBRE , "DESCRIPCION":combo.DESCRIPCION, "CANTIDAD":1 , "COSTO":Number(combo.COSTO), "IMAGEN_URL": combo.IMAGEN_URL, "PIZZAS": combo.PIZZAS}
    this.navCtrl.push(DetallePromocionalPage, {
      costo : costo,
      promo : promo,
      combo : comboTemp, 
    })
  }
  
  ordenar(combo){
    let comboTemp = {"id":combo.ID ,"nombre" :combo.NOMBRE , "cantidad":1 , "costo":Number(combo.COSTO), "imagenUrl": combo.IMAGEN_URL}
    if(this.objetivo == "nuevo-combo"){
      
      this.events.publish('nuevo-combo', comboTemp  );
      this.navCtrl.pop();
    }else{
      this.navCtrl.setRoot(CombinacionesPage ,{combo: comboTemp})
    }
  }

  abrirModalMartes(){
    let modal = this.modalCtrl.create(DetallePromocionalPage, {
      combos : this.combos,
      costo : this.combos[0].COSTO,
      promo : this.combos[0].NOMBRE,
      //combo : this.combos[0],
      combo : {"ID":this.combos[0].ID ,"NOMBRE": this.combos[0].NOMBRE , "DESCRIPCION":this.combos[0].DESCRIPCION, "CANTIDAD":1 , "COSTO":Number(this.combos[0].COSTO), "IMAGEN_URL": this.combos[0].IMAGEN_URL, "PIZZAS": [] }
    });
    modal.present();
  }

  abrirModalMiercoles(){
    let modal = this.modalCtrl.create(DetallePromocionalPage, {
      combos : this.combos,
      costo : this.combos[1].COSTO,
      promo : this.combos[1].NOMBRE,
      combo : {"ID":this.combos[1].ID ,"NOMBRE": this.combos[1].NOMBRE , "DESCRIPCION":this.combos[1].DESCRIPCION, "CANTIDAD":1 , "COSTO":Number(this.combos[1].COSTO), "IMAGEN_URL": this.combos[1].IMAGEN_URL, "PIZZAS": [] }

    });
    modal.present();
  }

  abrirModalJueves(){
    let modal = this.modalCtrl.create(DetallePromocionalPage, {
      combos : this.combos,
      costo : this.combos[2].COSTO,
      promo : this.combos[2].NOMBRE,
      combo : this.combos[2]
    });
    modal.present();
  }

  abrirModalSabado(){
    let modal = this.modalCtrl.create(DetallePromocionalPage, {
      combos : this.combos,
      costo : this.combos[3].COSTO,
      promo : this.combos[3].NOMBRE,
      combo : this.combos[3]
    });
    modal.present();
  }
  
  abrirModalDomingo(){
    let modal = this.modalCtrl.create(DetallePromocionalPage, {
      combos : this.combos,
      costo : this.combos[4].COSTO,
      promo : this.combos[4].NOMBRE,
      combo : this.combos[4]
    });
    modal.present();
  }
}
