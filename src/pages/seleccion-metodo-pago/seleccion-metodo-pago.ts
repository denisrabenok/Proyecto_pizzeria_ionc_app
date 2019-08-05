import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CheckoutPage } from '../checkout/checkout';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the SeleccionMetodoPagoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-seleccion-metodo-pago',
  templateUrl: 'seleccion-metodo-pago.html',
})
export class SeleccionMetodoPagoPage {
  selectedItems: any;
  //c: Array< {holder_name: String, expiry_year: String, expiry_month: String, icon: String, number: String}> = [];
  total_value: number;
  cards: Array< {holder_name: String, expiry_year: String, expiry_month: String, icon: String, number: String, card_token: String}> = [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private api: ApiServiceProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItems = navParams.get('cards');
    this.total_value = navParams.get('total_value');

    // Let's populate this page with some filler content for funzies
    this.getCards();
    

  
  }
  getCards(){
    this.api.getAllCards().then((data:any) => {
     this.cards = data;
    // Obtener las solo las tarjetas que no se repiten
    this.cards = this.cards.filter( ( el ) =>  this.selectedItems.findIndex( x => x.card_token === el.card_token)===-1);
    })

    
  }

  /**
 * Invoca al componente Checkout y envia las tarjetas para pagar
 * 
 * @param item tarjeta seleccionada
 */
  itemTapped(item) {
    let res = this.selectedItems.find(card => card.number === item.number)
    if (!res){
      let pedido = this.navParams.get('pedido');
      console.log("pedido en seleccion metodo ",pedido);
      this.selectedItems.push(item)
      this.navCtrl.setRoot(CheckoutPage, {
        cards: this.selectedItems,
        total_value: this.total_value, 
        pedido: pedido
      });
   }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SeleccionMetodoPagoPage');
  }

}

