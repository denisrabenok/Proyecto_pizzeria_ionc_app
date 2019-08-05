import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegistroPage } from '../registro/registro';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { RegistroFormPage } from '../registro-form/registro-form';

/**
 * Generated class for the InicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (window.localStorage.getItem("idUsuario") != null) {
      this.navCtrl.setRoot(HomePage, { });
    } 
  }

  login(event){
    this.navCtrl.push(LoginPage);
  }

  gotoRegistro(event){
    this.navCtrl.push(RegistroFormPage);
  }

}
