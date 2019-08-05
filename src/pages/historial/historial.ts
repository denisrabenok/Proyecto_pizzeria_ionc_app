import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav,InfiniteScroll } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { ViewChild } from '@angular/core';


/**
 * Generated class for the HistorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-historial',
  templateUrl: 'historial.html',
})
export class HistorialPage {

  ventas: any;

  public pizzas =  []
  public adicionales = []
  public combos = []



  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, public navParams: NavParams, private ventaProvider: ApiServiceProvider) {
    this.getHistorial();
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorialPage');
  }

  getHistorial() {
    this.ventaProvider.getVentas()
    .then(data => {
      this.ventas = data;
      
      this.ventas = this.ventas.reverse();

      console.log("ventas json", this.ventas);

      
      
      this.ventas.forEach(element => {
        element['descripcion'] = JSON.parse(element.descripcion);  
        this.cargar(element.descripcion);
        element['pizzasA'] = this.pizzas;
        element['adicionalesA'] = this.adicionales;
        element['combosA'] = this.combos;
      });
      console.log(this.ventas);
      
      
    });
  }


  cargar(data){
    

    this.pizzas =  []
    this.adicionales = []
    this.combos = []

        var response = data;

        
        console.log(response)
        if(response["STATUS"] != undefined  ||  response["STATUS"] != "OK" ){
          let carrito = response.CARRITO;
          carrito.PIZZAS.forEach((pizza :any) => {
            let composicion = {"id" : pizza.ID,"nombre": pizza.NOMBRE , "tamano":pizza.TAMANO , "cantidad" : Number(pizza.CANTIDAD) , "tipo" : pizza.TIPO, "costo": Number(pizza.COSTO) , "masa": pizza.MASA , "borde":pizza.BORDE };
            let ingredientes = [];
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
        }
          
        
  }

}

