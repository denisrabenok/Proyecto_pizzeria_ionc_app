import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tracking-pizza',
  templateUrl: 'tracking-pizza.html',
})
export class TrackingPizzaPage {
  
  estados  = [{"nombre":"Preparando", "descripcion":"Tu pizza ya esta siendo preparada", "hora":"10:00 " },
               {"nombre":"Ingredientes", "descripcion":"Los ingredientes" , "hora":"10:05"},
               {"nombre":"En el horno", "descripcion":"Tu pizza ya se encuentra en el horno" , "hora":"10:10"},
               {"nombre":"En camino", "descripcion":"Tu pedido ya ha salido del local" , "hora": "10:15"}]
  constructor(public navCtrl: NavController
            , public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackingPizzaPage');
  }

}
