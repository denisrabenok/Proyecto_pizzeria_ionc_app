import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, App } from 'ionic-angular';
import { BebidasPage } from '../bebidas/bebidas';
import { AcompanantesPage } from '../acompanantes/acompanantes';
import { Pizza } from "../../interfaces/IPizza";
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Adicional } from '../../interfaces/IAdicional';
import { CombinacionesPage } from '../combinaciones/combinaciones';

/**
 * Generated class for the AdicionalesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adicionales',
  templateUrl: 'adicionales.html',
})
export class AdicionalesPage {
  objetivo : String;

  /* objeto pizza recibida */
  pizza  : Pizza;
  
  /* costo de la pizza mas adicionales */
  costoTotal : Number;
  
  /* lista de adicionales marcados */
  adicionales: Array<Adicional> ;
 
  /*   Tabs  */
  bebidasTab = BebidasPage;
  acompanantesTab = AcompanantesPage;

   


 
  constructor(public app: App,
              public navCtrl: NavController, public navParams: NavParams
             ,public httpRequest : HttpRequestProvider
             ,public events : Events) {
            this.adicionales = new Array<Adicional>();

            this.objetivo = navParams.get("objetivo");
            this.pizza =   navParams.get("pizza");
            if(this.pizza != null){
              this.costoTotal = this.pizza.costo;
            }else{
              this.costoTotal = 0;
            }
  }

  
  ionViewDidLoad() {
      this.escucharEventos();
  }

  escucharEventos(){
    
    /* captura de evento de seleccion de adicionales */
    this.events.subscribe('seleccion-adicional', (adicional : Adicional) => {
      console.log("seleccion de adicional")
      var adicionalIndex;  
      if(adicional.checked){
         
          if (this.adicionales.filter(function(e ,index) { return e.id === adicional.id ; }).length > 0) { //si ya contiene el elemento
            adicionalIndex = this.adicionales.map(function (x) { return x.id; }).indexOf(adicional.id);
            this.adicionales[adicionalIndex] = adicional;                                               //se reemplaza
          }else{                                                                                                  //si no lo contenia
            this.adicionales.push(adicional);                                                              //se agrega
          }
        
        }else{                                                                                                      //si se quito de la lista
          adicionalIndex = this.adicionales.map(function (x) { return x.id; }).indexOf(adicional.id);
          this.adicionales.splice(adicionalIndex,1 );
        }
        this.actualizarPrecioTotal();
        
    });
   
      
  }
  
  ngOnDestroy(){
    this.events.unsubscribe('seleccion-adicional');

  }


  /**
   * Este metodo suma los costos de los ingredientes seleccionados al precio de la pizza recibida
   */
  actualizarPrecioTotal(){
      let total;
      if(this.pizza == null){
          total = 0;
      }else{
         total = this.pizza.costo;
      }
      
      this.adicionales.forEach(adicional => {
          total = Number(total) + Number(adicional.costoBase) * Number(adicional.cantidad )
      });  
      this.costoTotal = total;
  }

  siguiente(event){
    
    if(this.objetivo != null){
      if(this.objetivo == "nuevo-adicional"){
        this.events.publish('nuevo-adicional', this.adicionales);
        console.log("volviendo a combinaciones pop")
        console.log(this.adicionales)
        this.navCtrl.pop();
      }
    }else{
      this.navCtrl.setRoot(CombinacionesPage , {
        pizza : this.pizza,
        adicionales : this.adicionales
      
      });


      
    }
 
  }


  
}

