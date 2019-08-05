import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController  } from 'ionic-angular';
import { SeleccionMetodoPagoPage } from '../seleccion-metodo-pago/seleccion-metodo-pago';
import { ResumenDePagoPage } from '../resumen-de-pago/resumen-de-pago';

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  
  selectedItems: Array<any>;
  total_value : number = 0;

  pending_value : number = this.total_value;
  cards: Array< {holder_name: String, expiry_year: String, expiry_month: String, icon: String, number: String, card_token: String, value: number, installments: number}> = [];
  enablePayment: boolean = false;
  enableWarning:boolean = false;
/**
 * Elimina una tarjeta de la lista de metodos de pago seleccionados para esta compra
 * @param textInput input del formulario que contiene el valor a pagar con una sola tarjeta
 * @param i numero entero que representa a una tarjeta 
 */
removeCard(textInput: any, i:number){
  textInput.value = "";
  this.cards.splice(i,1);
  this.updatePendingValue();

}
/**
 * Actualiza los valores a pagar con cada tarjeta y el valor pendiente a pagar
 * @param textInput input del formulario que contiene el valor a pagar con una sola tarjeta
 * @param i numero entero que representa a una tarjeta seleccionada para realizar un pago
 */
updateValues(textInput: any, i: number){
  this.cards[i].value = Number(textInput.value.replace(/\s/g, ""));
  this.updatePendingValue();
}

/**
 * Actualiza el valor total pendiente a pagar
 */
updatePendingValue(){
  this.enablePayment = false;
  this.enableWarning = false;
  this.pending_value = this.total_value;
  for (let card of this.cards){
    if (card.value)
      this.pending_value = this.pending_value - card.value;
  }

  if (this.pending_value === 0){
    this.enablePayment = true;
  }
  if (this.pending_value < 0){
    this.enableWarning = true;
  }
}



/**
 * Invoca al componente Seleccion de metodo de pago para seleccionar tarjetas para pagar
 * 
 * 
 */
aniadirTarjeta() {
  let pedido = this.navParams.get('pedido');

  console.log("pedido en checkout 2 ",pedido);

  this.navCtrl.push(SeleccionMetodoPagoPage, { pedido: pedido, cards:this.cards, total_value: this.total_value
  });
}

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetController: ActionSheetController) {
    
    // Obtiene tarjetas seleccionadas para el pago desde la vista padre (Seleccion de metodo de pago)
    this.selectedItems = navParams.get('cards');
    this.total_value = navParams.get('total_value');
    this.updatePendingValue();
    if (this.selectedItems)
      this.cards=this.selectedItems;
      console.log(this.cards)
    for (let card of this.cards){
      card.installments = 0;
    }
  }

  /**
   * Invoca al componente resumen de pago para realizar el pago
   */
  resumenDePago() {
    let pedido = this.navParams.get('pedido');
    console.log("pedido en checkout ",pedido);
    this.navCtrl.push(ResumenDePagoPage, { cards:this.cards, total_value: this.total_value, pedido: pedido
    });
  }

  async presentActionSheet(card) {
    const actionSheet = await this.actionSheetController.create({
      
      buttons: [
        {
          text: 'Corriente',
          role: 'destructive',
          handler: () => {
            this.cards[card].installments = 0;
          }
        }, {
        text: '3 Meses',
        role: 'destructive',
        handler: () => {
          console.log('Delete clicked');
          this.cards[card].installments = 3;
        }
      }, {
        text: '6 Meses',
        handler: () => {
          this.cards[card].installments = 6;
          console.log('Share clicked');
        }
      }, {
        text: '9 Meses',
        handler: () => {
          this.cards[card].installments = 9;
          console.log('Play clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
    console.log(this.cards);
  }

}
