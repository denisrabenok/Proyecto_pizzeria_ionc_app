import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Events, AlertController, App } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { VirtualScroll } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { Pizza } from "../../interfaces/IPizza";
import { CombinacionesPage } from '../combinaciones/combinaciones';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-tradicionales',
  templateUrl: 'tradicionales.html',
})
@ViewChild('virtualScroll', { read: VirtualScroll })
export class TradicionalesPage {

  public objetivo : string;
  public pizzas:Array<Pizza> = new Array<Pizza>();
  public tamanos: any;
  public virtualScroll: VirtualScroll;
  tamanoElegido: any;
  costoSilver : Number;
  costoGold : Number;
  costoPlatinum : Number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public httpRequest: HttpRequestProvider, 
              public loadingCtrl: LoadingController, 
              private toastCtrl: ToastController, 
              public events : Events,
              public app: App,
              public alertCtrl: AlertController) {
     this.obtenerPizzas();
     this.objetivo = navParams.get("objetivo");
     this.cargarTamanos();
  }

  obtenerPizzas(){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    if(window.localStorage.getItem("userToken") != null){
      console.log(Constantes.getTradicionalesUrl(window.localStorage.getItem("userToken")))
      this.httpRequest.get(Constantes.getTradicionalesUrl(window.localStorage.getItem("userToken"))).then((data:any) => {
        var response = data.json();
        console.log(response);  
        if(response.STATUS == "OK"){
          for (var key in response.PIZZAS) {
            var child = response.PIZZAS[key];
            let pizza:Pizza = {
              id: child.ID,
              nombre : child.NOMBRE,
              descripcion : child.DESCRIPCION,
              imgUrl : child.IMAGEN_URL,
              favorita: child.FAVORITA,
              masa : null,
              borde : null,
              ingredientes : null,
              tamano : child.TAMANO,
              cantidad : 1,
              costo : child.COSTO
            }           
            this.pizzas.push(pizza);
          }
        } 
        loading.dismiss();             
      },(error : any)=>{
        console.log("Error");
        loading.dismiss();
      });
    }
  }

  favorito(event){
    var id = event.id
    var datos = {"PIZZA_ID": Number(id), "TOKEN": window.localStorage.getItem("userToken")};
    console.log(datos);
    var service;
    for(let pizza of this.pizzas){
      if(pizza.id == id){
        if(pizza.favorita == "1"){
          pizza.favorita = "0";
          service = "http://navi.pythonanywhere.com/rest/borrar_pizza_favorita";
        }else{
          pizza.favorita = "1";
          service = Constantes.getCrearPizzaFavoritasUrl();
        }
      } 
    }

    this.httpRequest.post(service, datos).then((data:any)=>{
      var response = data.json();
      console.log(response);
      if (response.STATUS == "ERROR"){
        this.presentToast(response.DETALLE);
      };      
    });
  }

  presentToast(mensaje: string , duracion? : Number, posicion? : string , mostrarBoton? : boolean , mensajeBoton? :string )  {
    let duration ,position , closeButtonText, showCloseButton;
    if(duracion == undefined){
        duration = 3000;
    }
    if(mostrarBoton == undefined){
      showCloseButton = false;
    }
    if(mensajeBoton == undefined){
      mensajeBoton = "";
    }
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: duration,
      position: position,
      cssClass: 'dark-trans',
      closeButtonText: closeButtonText,
      showCloseButton: showCloseButton
    });
    toast.present();
  }

  ordenar(pizza){
    if(this.objetivo == "nueva-tradicional"){
      this.events.publish('nueva-tradicional', pizza);
      this.navCtrl.pop();
    }else{
      this.navCtrl.push(CombinacionesPage, {
        tradicional : pizza
      });
    }
  }

  cargarTamanos() {
    try {
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getTamanosUrl(token)).then((data: any) => {
        var response = data.json();
        let lista = [];
        if (response["TAMANOS"] != undefined) {
          /* lista.push(response["TAMANOS"][0]);
           lista.push(response["TAMANOS"][1]);
           lista.push(response["TAMANOS"][2]);
           console.log (lista)*/
          if (response["TAMANOS"][0].NOMBRE == 'Mediana') {
            lista.push({ "id": response["TAMANOS"][0].ID, "nombre": response["TAMANOS"][0].NOMBRE, "nombreBase": response["TAMANOS"][0].NOMBRE_BASE });
          }
          if (response["TAMANOS"][1].NOMBRE == 'Familiar') {
            lista.push({ "id": response["TAMANOS"][1].ID, "nombre": response["TAMANOS"][1].NOMBRE, "nombreBase": response["TAMANOS"][1].NOMBRE_BASE });
          }
          if (response["TAMANOS"][2].NOMBRE == 'Extra grande') {
            lista.push({ "id": response["TAMANOS"][2].ID, "nombre": response["TAMANOS"][2].NOMBRE, "nombreBase": response["TAMANOS"][2].NOMBRE_BASE });
          }
          this.tamanos = lista;
          this.tamanoElegido = this.tamanos[0];

          this.pizzas.forEach(pizza => {
            if(pizza.tamano == 'Silver'){
              this.costoSilver = pizza.costo;
            }
            if(pizza.tamano == 'Gold'){
              this.costoGold = pizza.costo;
            }
            if(pizza.tamano == 'Platinum'){
              this.costoPlatinum = pizza.costo;
            }
          });
        } else {
          if (response["STATUS"] != 'OK') {
            this.cerrarPagina();
          }
        }
      }, (err) => {
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION, "cerrar");
      });
    }
    catch (err) {
      console.log('Error: ', err.message);
    }
  }

  cambiarPrecio(){     
    this.pizzas.forEach(pizza => {
      if(pizza.tamano == 'Silver'){
        if(this.tamanoElegido == this.tamanos[0]){
          pizza.costo = Number(this.costoSilver);
        }
        else if(this.tamanoElegido == this.tamanos[1]){
          pizza.costo = Number(this.costoSilver);
          pizza.costo = this.redondearDecimales((Number(this.costoSilver) + Number(Number(this.costoSilver)*0.332)), 2)
        }
         else if(this.tamanoElegido == this.tamanos[2]){
          pizza.costo = Number(this.costoSilver);
          pizza.costo = this.redondearDecimales((Number(this.costoSilver) + Number(Number(this.costoSilver)*0.667)), 2)
         }
      }
      else if (pizza.tamano == 'Gold'){
        if(this.tamanoElegido == this.tamanos[0]){
          pizza.costo = Number(this.costoGold);
        }
        else if(this.tamanoElegido == this.tamanos[1]){
          pizza.costo = Number(this.costoGold);
          pizza.costo = this.redondearDecimales((Number(this.costoGold) + Number(Number(this.costoGold)*0.294)), 2)
        }
         else if(this.tamanoElegido == this.tamanos[2]){
          pizza.costo = Number(this.costoGold);
          pizza.costo = this.redondearDecimales((Number(this.costoGold) + Number(Number(this.costoGold)*0.588)), 2) 
         }
      //pizza.costo = Number(pizza.costo) + Number(Number(pizza.costo)*0.33)
      }
      else if (pizza.tamano == 'Platinum'){
        if(this.tamanoElegido == this.tamanos[0]){
          pizza.costo = Number(this.costoPlatinum);
        }
        else if(this.tamanoElegido == this.tamanos[1]){
          pizza.costo = Number(this.costoGold);
          pizza.costo = this.redondearDecimales((Number(this.costoPlatinum) + Number(Number(this.costoPlatinum)*0.251)), 2) 
        }
         else if(this.tamanoElegido == this.tamanos[2]){
          pizza.costo = Number(this.costoGold);
          pizza.costo = this.redondearDecimales((Number(this.costoPlatinum) + Number(Number(this.costoPlatinum)*0.502)), 2) 
         }
      }
    });
  }
  
  mostrarMensaje(titulo: string, mensaje: string, cerrar?) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            if (cerrar != undefined)
              this.app.getRootNavs()[0].setRoot(HomePage)
          }
        }
      ]
    });
    alert.present();
  }

  cerrarPagina() {
    let alert = this.alertCtrl.create({
      title: 'Algo ha salido mal',
      message: 'Lo sentimos, estamos teniendo inconvenientes, por favor intentalo nuevamente',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            if (this.objetivo != null) {
              this.app.getRootNavs()[0].pop();
            } else {
              this.navCtrl.setRoot(HomePage)
            }
          }
        }
      ]
    });
    alert.present();
  }

  redondearDecimales(numero, decimales) {
   let numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}');   // Expresion regular para numeros con un cierto numero de decimales o mas
    if (numeroRegexp.test(numero)) {         // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
        return Number(numero.toFixed(decimales));
    } else {
        return Number(numero.toFixed(decimales)) === 0 ? 0 : numero;  // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
    }
}

}
