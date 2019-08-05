import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, LoadingController, AlertController, Platform } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { ListaPedidosPage } from '../lista-pedidos/lista-pedidos';
import { ValoresPage  } from '../valores/valores';

@IonicPage()
@Component({
  selector: 'page-forma-pago',
  templateUrl: 'forma-pago.html',
})

export class FormaPagoPage {
  opct : string
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public toastCtrl: ToastController,
              public httpRequest : HttpRequestProvider, 
              public events: Events, 
              public loadingCtrl: LoadingController, 
              public alertCtrl : AlertController ,
              public platform: Platform) {         
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormaPagoPage');
    let tradicionales = this.navParams.get("tradicionales");
    console.log(tradicionales)
  }

  efectivo(){
    let pizzas = this.navParams.get("pizzas");
    let adicionales = this.navParams.get("adicionales");
    let tradicionales = this.navParams.get("tradicionales");
    console.log(tradicionales)
    let combos = this.navParams.get("combos");
    let coordenada = this.navParams.get("coordenada");
    let poligono = this.navParams.get("poligono");
    let local = this.navParams.get("local");

    console.log(pizzas)
    console.log(adicionales)
    console.log(tradicionales)
    console.log(combos)

    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    let token = window.localStorage.getItem("userToken");
    let tokenFirebase = window.localStorage.getItem("firebaseToken");
    console.log(token)
    console.log(tokenFirebase)
    
    let elementos = []
    if(pizzas != null || pizzas != undefined){
      pizzas.forEach(elemento=> {
        elementos.push({"ID":elemento.id , "CANTIDAD":elemento.cantidad , "TIPO":'PIZZA'})
      });
    }
    if(adicionales != null || adicionales != undefined){
      adicionales.forEach(elemento=> {
        elementos.push({"ID":elemento.id , "CANTIDAD":elemento.cantidad , "TIPO": 'ADICIONAL'})
      });  
    }

    if(tradicionales != null || tradicionales != undefined){
        tradicionales.forEach(elemento=> {
      elementos.push({"ID":elemento.id , "CANTIDAD":elemento.cantidad , "TIPO": 'PIZZA'})
    });
    } 
    
    if(combos != null || combos != undefined){
      combos.forEach(elemento=> {
        elementos.push({"ID":elemento.ID , "CANTIDAD":elemento.CANTIDAD , "TIPO": 'COMBO'})
      }); 
    }
    
    let pedido = {};
   
    if(local == null){
      pedido = {"TOKEN": token  , "TOKEN_FIREBASE": tokenFirebase , "FORMA_PAGO" : "1" , "ELEMENTOS":elementos
      , "DIRECCION":{"LATITUD": coordenada.lat , "LONGITUD":coordenada.lng} , "POLIGONO_ID": poligono }
      console.log(pedido);
    }else{
      pedido = {"TOKEN": token  , "TOKEN_FIREBASE": tokenFirebase , "FORMA_PAGO" : "1" , "ELEMENTOS":elementos
      , "POLIGONO_ID": poligono}
    }
    console.log(pedido);
    this.httpRequest.post(Constantes.CREAR_PEDIDOS, pedido).then((data : any)=>{
      var response = data.json();
      console.log(response)
      if(response["STATUS"] == 'OK'){
        this.mostrarMensaje("Pedido enviado","Tu pedido ha sido recibido exitosamente, ahora puedes revisar el estado de tu pedido", "OK");
        loading.dismiss();
      }else{
        loading.dismiss();
        this.mostrarMensaje("Solicitud reprobada","Estamos teniendo inconvenientes, por favor intenta nuevamente", "ERROR");
      
      }
    }, (err)=>{
      loading.dismiss();
      this.mostrarMensaje("","Estamos teniendo inconvenientes, por favor intenta nuevamente","ERROR");
    });
  }

  tarjeta(){
    let elementos = []

    let pizzas = this.navParams.get("pizzas");
    let adicionales = this.navParams.get("adicionales");
    let combos = this.navParams.get("combos");
    let promocionales = this.navParams.get("promocionales");
    let tradicionalesPromo = this.navParams.get("tradicionalesPromo");
    console.log(tradicionalesPromo)
    let coordenada = this.navParams.get("coordenada");
    let poligono = this.navParams.get("poligono");
    let local = this.navParams.get("local");
    let token = window.localStorage.getItem("userToken");
    let tokenFirebase = window.localStorage.getItem("firebaseToken");
       if(pizzas != null || pizzas != undefined){
      pizzas.forEach(elemento=> {
        elementos.push({"ID":elemento.id , "CANTIDAD":elemento.cantidad , "TIPO":elemento.tipo})
      });
	   }
	  if(promocionales != null || promocionales != undefined){
		  promocionales.forEach(elemento=> {
			elementos.push({"ID":elemento.id , "CANTIDAD":elemento.cantidad , "TIPO":elemento.tipo})
		  });
	  }else{
		  promocionales=[];
	  }
	  if(tradicionalesPromo != null || tradicionalesPromo != undefined){
      tradicionalesPromo.forEach(elemento=> {
        elementos.push({"ID":elemento.id , "CANTIDAD":elemento.cantidad , "TIPO":elemento.tipo})
      });
	  }else{
		  tradicionalesPromo=[];
	  }
	  if(adicionales != null || adicionales != undefined){
      adicionales.forEach(elemento=> {
        elementos.push({"ID":elemento.id , "CANTIDAD":elemento.cantidad , "TIPO":elemento.tipo})
      });
	  }
	  if(combos != null || combos != undefined){
      combos.forEach(elemento=> {
        elementos.push({"ID":elemento.id , "CANTIDAD":elemento.cantidad , "TIPO":elemento.tipo})
      });
	  }
      let pedido = {};
      pedido = {"TOKEN": token  , "TOKEN_FIREBASE": tokenFirebase , "FORMA_PAGO" : "0" , "ELEMENTOS":elementos
        , "POLIGONO_ID": poligono}
        console.log("pedido en forma ",pedido);
      this.navCtrl.push(ValoresPage, {
        promocionales : promocionales,
        tradicionalesPromo : tradicionalesPromo,
        pedido: pedido,
      }); 
  }


  mostrarMensaje(titulo: string ,mensaje: string , objetivo: string){
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            if(objetivo == "OK"){
              this.navCtrl.setRoot(ListaPedidosPage);
            }        
          }
        }        
      ]
    });
    alert.present();
   }
}
