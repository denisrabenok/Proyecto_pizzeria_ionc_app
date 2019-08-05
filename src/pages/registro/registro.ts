import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { InicioPage } from '../inicio/inicio';
import { RegistroSocialPage } from '../registro-social/registro-social';
import { RegistroFormPage} from '../registro-form/registro-form';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Facebook, FacebookLoginResponse  } from '@ionic-native/facebook';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoadingController } from 'ionic-angular';


/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {
  loader = this.loading.create({
    content: 'Cargando...',
  });


  dataUsuario = {
    "CORREO" : "",
    "CONTRASENA" : "",
    "NOMBRES" : "",
    "APELLIDOS" : "",
    "CEDULA" : "",
    "TELEFONO" : ""
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams, public authService: AuthServiceProvider,
    public fb: Facebook, private gplus: GooglePlus,
    private afAuth: AngularFireAuth
    ,public loading: LoadingController) {

  }

  registro_form(event) {
    this.navCtrl.push(RegistroFormPage);
  }

  

  getFacebookData(event){
   // this.loader.present();
    // Login with permissions
    this.fb.login(['public_profile', 'email'])
    .then( (res: FacebookLoginResponse) => {
        // The connection was successful
        if(res.status == "connected") {
            console.log(res);
            // Get user ID and Token
            var fb_id = res.authResponse.userID;
           // var fb_token = res.authResponse.accessToken;

            // Get user infos from the API
            this.fb.api("/me?fields=email,last_name,first_name", []).then((user) => {

                // Get the connected user details
                var nombres    = user.first_name;
                var apellidos  = user.last_name;
                var correo     = user.email;
                var userId     = user.id;
                this.navCtrl.push(RegistroFormPage, {
                  nombres : nombres,
                  apellidos :apellidos,
                  correo:  correo,
        
                });
             //   this.registerSocialMedia(nombres, apellidos, correo);

            });

        }
        // An error occurred while loging-in
        else {
        //  this.loader.dismiss();
            console.log("An error occurred...");

        }

    })
    .catch((e) => {
       //c this.loader.dismiss();
        console.log('Error logging into Facebook', e);
    });
  }

  getGoogleData(event) {
    this.autenticarGoogle();
  }

  async autenticarGoogle(){
  //  this.loader.present();
    try {

       var googleUser = await this.gplus.login({
        'webClientId': '320424180530-q7cirh7otkfal6v6c5ci2vlr83d71goo.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })

      console.log(googleUser);
      this.navCtrl.push(RegistroFormPage, {
        nombres : googleUser.givenName,
        apellidos :googleUser.familyName,
        correo:  googleUser.email,

      });
    //  await this.afAuth.auth.signInWithCredential(
    //    firebase.auth.GoogleAuthProvider.credential(googleUser.idToken)
    //  )

     //this.registerSocialMedia(googleUser.givenName,
     //                        googleUser.familyName,
     //                        googleUser.email);

    } catch(err) {
   //   this.loader.dismiss();
      console.log(err)
    }
  }

  registerSocialMedia(nombres, apellidos, correo){
   // this.loader.dismiss();
    this.dataUsuario.NOMBRES = nombres;
    this.dataUsuario.APELLIDOS = apellidos;
    this.dataUsuario.CORREO = correo;
    this.navCtrl.push(RegistroSocialPage, this.dataUsuario);

  }


}