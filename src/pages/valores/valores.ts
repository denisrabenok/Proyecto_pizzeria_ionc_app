import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll, LoadingController, AlertController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { CheckoutPage } from '../checkout/checkout';
import { ViewChild } from '@angular/core';
import { Constantes } from '../../util/constantes';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-valores',
  templateUrl: 'valores.html',
})
export class ValoresPage {
  productos: any;
  codigoA: any;
  totalCarrito : Number ;
  code: string;
  descuento: Number = 0 ;
  opc : string;
  optativa : string

  public pizzas =  []
  public adicionales = []
  public promocionales = [];
  public tradicionalesPromo = []
  public combos = []

  public cargando = false;
  public costoTotal : Number;

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,  
    public httpRequest : HttpRequestProvider, 
    public loadingCtrl: LoadingController,
    public alertCtrl : AlertController ,
    private carritoProvider: ApiServiceProvider) {
    this.promocionales = this.navParams.get("promocionales");
    this.tradicionalesPromo = this.navParams.get("tradicionalesPromo");
    console.log(this.tradicionalesPromo)
    this.getProductos();
  }

  ionViewWillUnload(){
    this.pizzas.forEach((pizza) => {
      this.borrarElementoServidor(pizza, 'PIZZA');
    });
    this.adicionales.forEach((adicional) => {
      this.borrarElementoServidor(adicional, 'ADICIONAL');
    });
    this.combos.forEach((combo) => {
      this.borrarElementoServidor(combo, 'COMBO');
    });
    this.promocionales.length = 0;
    this.tradicionalesPromo.length = 0;
  }

  getTotal(){
    this.totalCarrito = this.costoTotal;
  }

  getProductos() {
    this.cargarCarrito();
  }

  cargarCarrito(){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    this.cargando = true;
    try{     
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getCarritoUrl(token)).then((data : any) => {        
        var response = data.json();
        console.log(response)
        if(response["STATUS"] != undefined  ||  response["STATUS"] != "OK" ){
          let carrito = response.CARRITO;
          
          carrito.PIZZAS.forEach((pizza : any) => {
            
            let composicion = {"id" : pizza.ID,"nombre": pizza.NOMBRE , "tamano":pizza.TAMANO , "cantidad" : Number(pizza.CANTIDAD) , "tipo" : pizza.TIPO, "costo": Number(pizza.COSTO) , "masa": pizza.MASA , "borde":pizza.BORDE };
            let ingredientes = [];
            this.optativa = 'promo';
            pizza.INGREDIENTES.forEach(ingrediente => {
              console.log(ingrediente)
              ingredientes.push(ingrediente)
            });
            composicion["ingredientes"] = ingredientes;
            this.pizzas.push(composicion);           
          });
          carrito.ADICIONALES.forEach((adicional :any) => {
            this.adicionales.push({"id": adicional.ID , "nombre": adicional.NOMBRE , "costo": Number(adicional.COSTO) , "cantidad" : Number(adicional.CANTIDAD) , "imagenUrl":adicional.IMAGEN_URL , "tipo": adicional.TIPO});
          });
          carrito.COMBOS.forEach((combo :any) => {
            this.combos.push({"id": combo.ID , "nombre": combo.NOMBRE , "costo": Number(combo.COSTO) , "cantidad" : Number(combo.CANTIDAD) , "imagenUrl":combo.IMAGEN_URL , "tipo": combo.TIPO});
          });          
          this.actualizarPrecioTotal();
          this.cargando = false;
          loading.dismiss();     
        }else{
          this.cargando = false;
          loading.dismiss();
          this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
        }      
      }, (err)=>{
        this.cargando = false;
        loading.dismiss();
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
      });
    }
    catch(err) {
      this.cargando = false;
      loading.dismiss();
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
            this.navCtrl.setRoot(HomePage)
          }
        }         
      ]
    });
    alert.present(); 
   }

   actualizarPrecioTotal(){
    let totalPizzas = 0;
    let totalPizzasPromo = 0;
    let totalAdicionales = 0 ;
    let totalCombos = 0;
    let totalTradicionalesPromo = 0 ;
    //Calular total de pizzas 
    if(this.pizzas.length > 0){
      this.pizzas.forEach( pizza => {
        totalPizzas += Number(pizza.costo)  * Number(pizza.cantidad);
      });
    }
     //Calcular total de pizza promo
     if(this.promocionales.length > 0){
      console.log(this.promocionales)
      this.promocionales.forEach( (pizzaPromo) => {
      totalPizzasPromo += Number(pizzaPromo.costo) * Number(pizzaPromo.cantidad)
    });  
  }
    //Calcular total de adicionales
    if(this.adicionales.length > 0){
       this.adicionales.forEach( (adicional) => {
          totalAdicionales += Number(adicional.costo)  * Number(adicional.cantidad)
      });  
    }
    if (this.tradicionalesPromo.length != 0) {
      this.tradicionalesPromo.forEach((pizza) => {
        totalTradicionalesPromo += Number(pizza.costo) * Number(pizza.cantidad)
      });
    } else {
      totalTradicionalesPromo = 0;
    }
    //Calcular total de combos
    /*if(this.combos.length > 0){
      
      this.combos.forEach( (combo) => {
         totalCombos += Number(combo.costo)  * Number(combo.cantidad)
     });  
   }*/
    
    //suma de todos los productos
    this.costoTotal = totalPizzas + totalPizzasPromo + totalAdicionales + totalCombos + totalTradicionalesPromo;
 }

  consultaCodigo(event, codigo){
    this.carritoProvider.getCodigo(codigo)
    .then(data => {
      this.codigoA = data;
      console.log(this.codigoA);
      this.getDecuento();
    });
  }

  getDecuento(){
    if (this.codigoA.estado == false){
      this.descuento = this.codigoA.descuento;
      this.getTotal();
      this.removeCodigo(this.codigoA); 
    } else {
      console.log("Cupon ya usado")
    }  
  }

  async removeCodigo(cupon) {             
    const codigoAdd = {
        codigo: cupon.codigo,
        descuento: cupon.descuento,
        estado: true,
    };
    await this.carritoProvider.setCodigo(codigoAdd);
  }

 /**
   * Invoca al componente resumen de pago para realizar el pago
   */
  checkout() {
    let pedido = this.navParams.get('pedido');
    console.log("pedido en valores ",pedido);
    this.navCtrl.push(CheckoutPage, { pedido: pedido, total_value: this.costoTotal });
  }

  borrarElementoServidor(elemento, tipo) {
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
      }, (err) => {
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
      });
    }
    catch (err) {
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }
  }
}