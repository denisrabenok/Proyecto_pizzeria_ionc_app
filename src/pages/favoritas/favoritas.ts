import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events, AlertController, Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { Pizza } from "../../interfaces/IPizza";
import { HomePage } from '../home/home';
import { Masa } from '../../interfaces/IMasa';
import { Borde } from '../../interfaces/IBorde';
import { Ingrediente } from '../../interfaces/IIngrediente';
import { Porcion } from '../../interfaces/IPorcion';
import { CombinacionesPage } from '../combinaciones/combinaciones';
import { CarritoPage } from '../carrito/carrito';


@IonicPage()
@Component({
  selector: 'page-favoritas',
  templateUrl: 'favoritas.html',
})
export class FavoritasPage {
  objetivo : String;

  public pizzas:Array<Pizza> = new Array<Pizza>();

  constructor(public navCtrl: NavController
              , public navParams: NavParams
              , public httpRequest: HttpRequestProvider
              , public loadingCtrl: LoadingController
              , private toastCtrl: ToastController
              , public alertCtrl: AlertController
              , public events : Events
              , public platform: Platform) {

            platform.registerBackButtonAction(() => {
              this.navCtrl.setRoot(HomePage)
            },2)
        
           
           this.obtenerPizzas();
           this.objetivo = navParams.get("objetivo");
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritasPage');
  }

  obtenerPizzas(){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    var token = window.localStorage.getItem("userToken");
    if(token != null){
      this.httpRequest.get(Constantes.getPizzasFavoritas(token)).then((data : any) => {
        var response = data.json();
        console.log(response);  
        if(response.STATUS == "OK"){
          for (var key in response.PIZZAS_FAVORITAS) {
            var child = response.PIZZAS_FAVORITAS[key];
            let pizza:Pizza ={
              id: child.PIZZA_ID,
              nombre : child.NOMBRE,
              imgUrl : child.IMAGEN_URL,
              masa : null,
              borde : null,
              cantidad : null,
              descripcion : null,
              ingredientes : null,
              tamano : null,
              costo : child.COSTO,
              favorita: "1"
            }
            console.log(pizza);
            this.pizzas.push(pizza);
          }
        }
        loading.dismiss();       
      }, (error : any)=>{
        console.log("Error")
        loading.dismiss();
        this.presentToast("Revisa tu conexion a internet!");
      });
    }
    
    
  }

  favorito(event){
    var id = event.id
    
    var datos = {"PIZZA_ID": Number(id), "TOKEN": window.localStorage.getItem("userToken")};
    console.log(datos);
    var service;
    let pizzaIndex = this.pizzas.map(function (x) { return x.id; }).indexOf(id);
    let pizza = this.pizzas[pizzaIndex];
    if(pizza.favorita == "1"){
        this.confirmacionQuitarFav(pizza.id , datos)
        
      }else{
        pizza.favorita = "1";
        service = Constantes.getCrearPizzaFavoritasUrl();
        this.llamadaServicioFavoritas(service ,datos);
    }
    
  }

  llamadaServicioFavoritas(service , datos){
    this.httpRequest.post(service, datos).then((data:any)=>{
      var response = data.json();
      console.log(response);
      if (response.STATUS == "ERROR"){
        this.presentToast(response.DETALLE);
      };      
    }, (err)=>{
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    });
  }

  ordenar(pizza){
     this.obtenerDetallesPizza(pizza)
     
  }

  obtenerDetallesPizza(pizza){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present()
  
    try {
      let token = window.localStorage.getItem("userToken");

      this.httpRequest.get(Constantes.getVerPizzaUrl(token ,pizza.id)).then((data : any) => {
        var response = data.json();
        console.log(response)
        if(response["PIZZA"] != undefined){
          let masa  : Masa = {costo: response.PIZZA.MASA.COSTO , id :  response.PIZZA.MASA.ID , nombre :  response.PIZZA.MASA.NOMBRE ,  descripcion : null,  tamano :  response.PIZZA.MASA.TAMANO  }
          let borde  : Borde = {costo: response.PIZZA.BORDE.COSTO , id :  response.PIZZA.BORDE.ID , nombre :  response.PIZZA.BORDE.NOMBRE ,  descripcion : null,  tamano :  response.PIZZA.BORDE.TAMANO  }
          let ingredientes = new Array<Ingrediente>();
          response.PIZZA.INGREDIENTES.forEach(element => {
            let porcion : Porcion = {id : null , nombre : element.PORCION , valor : null}
            let ingrediente  : Ingrediente = {porcion : porcion , costoBase: element.COSTO , id :  element.ID , nombre :  element.NOMBRE ,  descripcion : element.DESCRIPCION,  tamano :  element.TAMANO , imagenUrl : element.IMAGEN_URL  , checked  : true}
            ingredientes.push(ingrediente)
          });
          let pizza  : Pizza ={id : response.PIZZA.ID  , masa :masa, borde: borde,  ingredientes:ingredientes , costo:0 , nombre : response.PIZZA.NOMBRE , descripcion : null, imgUrl : null, tamano : response.PIZZA.TAMANO , cantidad:1, favorita : null};
         
          if(this.objetivo == "nueva-favorita"){
            this.events.publish('nueva-favorita', pizza);
            this.navCtrl.pop();
          }else{
            this.navCtrl.setRoot(CombinacionesPage ,{pizza: pizza})
          }
          loading.dismiss();
        }else{
          loading.dismiss();
          if(response["STATUS"] != 'OK'){
            this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
          }
        }
        
      }, (err)=>{
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
      });
    }
    catch(err) {
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }
  }

  capitalize(palabra: string) 
{
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
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

   confirmacionQuitarFav(id , datos) {
    let alert = this.alertCtrl.create({
      title: 'Quitar de favoritas',
      message: '¿Estas seguro de quitar esta pizza de tu lista de favoritas?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        
        },
        {
          text: 'Si',
          handler: () => {
            let pizzaIndex = this.pizzas.map(function (x) { return x.id; }).indexOf(id);
            let pizza = this.pizzas[pizzaIndex];
            pizza.favorita = "0";
            this.pizzas.splice(pizzaIndex,1 );
            let service = Constantes.getBorrarPizzaFavoritasUrl();
            this.llamadaServicioFavoritas(service , datos)
          }
        }
      ]
    });
    alert.present();
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
}

