import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, FabContainer, ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Pizza } from '../../interfaces/IPizza';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';
import { FormaEntregaPage } from '../forma-entrega/forma-entrega';
import { PizzaTresPage } from '../pizza-tres/pizza-tres';
import { PizzaUnoPage } from '../pizza-uno/pizza-uno';
import { PizzaDosPage } from '../pizza-dos/pizza-dos';

@IonicPage()
@Component({
  selector: 'page-carrito',
  templateUrl: 'carrito.html',
})
export class CarritoPage {

  public pizzas = []
  public adicionales = []
  public combos = []
  public promocionales = [];
  public tradicionales = [];
  public tradicionalesPromo = [];
  opc: string;
  public cargando = false;
  public costoTotal: Number;

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public toastCtrl: ToastController
    , public httpRequest: HttpRequestProvider
    , public events: Events
    , public loadingCtrl: LoadingController
    , public alertCtrl: AlertController,
    public platform: Platform) {

    platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(HomePage)
    }, 2)
    
    //this.cargarCarrito();
   this.tradicionales = navParams.get("tradicionales");
   this.combos = navParams.get("combos");
   this.pizzas = navParams.get("pizzas");
   this.adicionales = navParams.get("adicionales");
   console.log(navParams.get("pizzas"))
   console.log(navParams.get("combos"))
   console.log(navParams.get("tradicionales"))
   console.log(navParams.get("adicionales"))
   this.actualizarPrecioTotal();
  }


  ionViewDidLoad() {
    this.promocionales = this.navParams.get("promocionales");
    this.tradicionalesPromo = this.navParams.get("tradicionalesPromo");
  }

  /** Este metodo disminuye la cantidad del elemento recibido */
  disminuirCantidad(elemento) {
    elemento.cantidad = Number(elemento.cantidad) - 1;
    this.actualizarPrecioTotal();
  }

  /** Este metodo aumenta la cantidad del elemento recibido */
  aumentarCantidad(elemento) {
    elemento.cantidad = Number(elemento.cantidad) + 1;
    this.actualizarPrecioTotal();
  }

  cargarCarrito() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();
    this.cargando = true;
    try {
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getCarritoUrl(token)).then((data: any) => {
        var response = data.json();
        console.log(response)
        if (response["STATUS"] != undefined || response["STATUS"] != "OK") {
          let carrito = response.CARRITO;
          console.log(carrito)
          carrito.PIZZAS.forEach((pizza: any) => {
            let composicion = { "INGREDIENTES": pizza.INGREDIENTES, "ID": pizza.ID, "NOMBRE": pizza.NOMBRE, "TAMANO": pizza.TAMANO, "CANTIDAD": Number(pizza.CANTIDAD), "TIPO": pizza.TIPO, "COSTO": Number(pizza.COSTO), "MASA": pizza.MASA, "BORDE": pizza.BORDE };
            let ingredientes = [];
            pizza.INGREDIENTES.forEach(ingrediente => {
              ingredientes.push(ingrediente)
            });
            composicion["INGREDIENTES"] = ingredientes;
            this.pizzas.push(composicion);
          });

          carrito.ADICIONALES.forEach((adicional: any) => {
            this.adicionales.push({ "id": adicional.ID, "nombre": adicional.NOMBRE, "costo": Number(adicional.COSTO), "cantidad": Number(adicional.CANTIDAD), "imagenUrl": adicional.IMAGEN_URL, "tipo": adicional.TIPO });
          });
          carrito.COMBOS.forEach((combo: any) => {
            let composicionCombo = { "ID": combo.ID, "NOMBRE": combo.NOMBRE, "COSTO": Number(combo.COSTO), "CANTIDAD": Number(combo.CANTIDAD), "IMAGEN_URL": combo.IMAGEN_URL, "TIPO": combo.TIPO, "PIZZAS": combo.PIZZAS };
           let combos = this.navParams.get("combos");
           console.log(combos)
           let pizzas = [];
           combos.forEach(element => {
             if(combo.NOMBRE == element.NOMBRE){
               element.PIZZAS.forEach(element => {
                pizzas.push(element);
               });
              composicionCombo["PIZZAS"] = pizzas;
             }
           });
            this.combos.push(composicionCombo);
          console.log(this.combos)
          });
          this.actualizarPrecioTotal();

          this.cargando = false;
          loading.dismiss();
        } else {
          this.cargando = false;
          loading.dismiss();
          this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
        }
      }, (err) => {
        this.cargando = false;
        loading.dismiss();
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
      });
    }
    catch (err) {
      this.cargando = false;
      loading.dismiss();
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
          handler: () => {
            this.navCtrl.setRoot(HomePage)
          }
        }
      ]
    });
    alert.present();
  }

  actualizarPrecioTotal() {
    let totalPizzas = 0;
    //let totalPizzasPromo = 0;
    let totalAdicionales = 0;
    let totalCombos = 0;
    let totalTradicional = 0;

    //let totalTradicionalesPromo = 0 ;
    //Calular total de pizzas 
    //Calcular total de pizza promo
    if (this.pizzas != null) {
      console.log(this.pizzas)
      if (this.pizzas.length != 0) {
        this.pizzas.forEach((pizza) => {
          totalPizzas += Number(pizza.costo) * Number(pizza.cantidad)
        });
      } else {
        totalPizzas = 0;
      }
      console.log(totalPizzas)
    }

    //Calcular total de pizza promo
    if (this.tradicionales != null) {
      if (this.tradicionales.length != 0) {
        this.tradicionales.forEach((tradicional: Pizza) => {
          totalTradicional += Number(tradicional.costo) * Number(tradicional.cantidad)
        });
      } else {
        totalTradicional = 0;
      }
      console.log(totalTradicional)
    }
      
    //Calcular total de adicionales
    if (this.adicionales != null) {
      if (this.adicionales.length != 0) {
        this.adicionales.forEach((adicional) => {
          totalAdicionales += Number(adicional.costoBase) * Number(adicional.cantidad)
        });
      } else {
        totalAdicionales = 0;
      }
      console.log(totalAdicionales)
    }
   /* if (this.adicionales.length > 0) {
      this.adicionales.forEach((adicional) => {
        totalAdicionales += Number(adicional.costo) * Number(adicional.cantidad)
      });
    }*/

    //Calcular total de combos
    if (this.combos != null) {
      if (this.combos.length != 0) {
        this.combos.forEach((combo) => {
          totalCombos += Number(combo.COSTO) * Number(combo.CANTIDAD)
        });
      } else {
        totalCombos = 0;
      }
      console.log(totalCombos)
    }
    //suma de todos los productos
    this.costoTotal = totalPizzas +  totalAdicionales + totalCombos + totalTradicional;
  }

  ordenar() {
    this.navCtrl.push(FormaEntregaPage, {
      pizzas: this.pizzas,
      //promocionales : this.promocionales,
      tradicionales : this.tradicionales,
      adicionales: this.adicionales,
      combos: this.combos,
    });
  }

  editarPizza(pizza: Pizza, nombre: string) {
    if (nombre == 'Pizza Uno') {
      this.abrirPizzaUnoPage();
    }
    if (nombre == 'Pizza Dos') {
      this.abrirPizzaDosPage();
    }
    if (nombre == 'Pizza Tres') {
      this.abrirPizzaTresPage();
    }
  }

  abrirPizzaUnoPage() {
    this.navCtrl.push(PizzaUnoPage, {
      objetivo: "editar-pizza",
      pizzas: this.pizzas,
      promocionales : this.promocionales
    });
  }

  abrirPizzaDosPage() {
    this.navCtrl.push(PizzaDosPage, {
      objetivo: "editar-pizza",
      pizzas: this.pizzas,
      promocionales : this.promocionales
    });
  }

  abrirPizzaTresPage() {
    this.navCtrl.push(PizzaTresPage, {
      objetivo: "editar-pizza",
      pizzas: this.pizzas,
      promocionales : this.promocionales
    });
  }

  /**
 * Este metodo elimina un elemento del resumen
 * @param elemento 
 */
  borrarElementoServidor(elemento, tipo) {
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    let token = window.localStorage.getItem("userToken");
    let cuerpo = { "TOKEN": token, "ID": elemento.id, "TIPO": tipo }
    try {
      this.httpRequest.post(Constantes.BORRAR_ELEMENTO_CARRITO, cuerpo).then((data: any) => {
        var response = data.json();
        if (response["STATUS"] == "OK") {
          if (tipo == "PIZZA") {
            let index = this.pizzas.map(function (x) { return x.id; }).indexOf(elemento.id);
            this.pizzas.splice(index, 1);
          } else if (tipo == "ADICIONAL") {
            let index = this.adicionales.map(function (x) { return x.id; }).indexOf(elemento.id);
            this.adicionales.splice(index, 1);
          } else if (tipo == "COMBO") {
            let index = this.combos.map(function (x) { return x.id; }).indexOf(elemento.id);
            this.combos.splice(index, 1);
          }
          this.actualizarPrecioTotal();
        }
        loading.dismiss();
      }, (err) => {
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
      });
    }
    catch (err) {
      loading.dismiss();
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }
  }

  presentToast(mensaje: string, duracion?: Number, posicion?: string, mostrarBoton?: boolean, mensajeBoton?: string) {
    let duration, position, closeButtonText, showCloseButton;
    if (duracion == undefined) {
      duration = 3000;
    }
    if (mostrarBoton == undefined) {
      showCloseButton = false;
    }
    if (mensajeBoton == undefined) {
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

  eliminarElemento(elemento, tipo) {
    let alert = this.alertCtrl.create({
      title: 'Borrar elemento',
      message: '¿Estás seguro que deseas borrar este elemento del carrito? ',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Si',
          handler: () => {
            this.borrarElementoServidor(elemento, tipo)
          }
        }
      ]
    });
    alert.present();
  }
}
