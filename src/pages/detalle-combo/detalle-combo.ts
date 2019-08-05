import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ComboPage } from '../combo/combo';

@IonicPage()
@Component({
  selector: 'page-detalle-combo',
  templateUrl: 'detalle-combo.html',
})
export class DetalleComboPage {

  combo: any;
  pizzas = [];
  adicionales = [];
  pizzas_dic = {};
  t = [];
  add = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {

    platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(ComboPage)
    }, 2)
    this.combo = navParams.get('data');
    this.pizzas = this.combo['PIZZAS'];
    for (var key in this.pizzas) {
      this.t.push(this.pizzas[key]);
    }

    this.adicionales = this.combo['ADICIONALES'];
    for (var i in this.adicionales) {
      this.add.push(this.adicionales[i]);
    }
  }

ionViewDidLoad() {
  console.log('ionViewDidLoad DetalleComboPage');
}

}
