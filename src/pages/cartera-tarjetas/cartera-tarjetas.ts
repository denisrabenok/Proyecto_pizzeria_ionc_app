import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Storage } from '@ionic/storage';
import {  AlertController } from 'ionic-angular';
import { CarritoPage } from '../carrito/carrito';




/**
 * Generated class for the CarteraTarjetasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cartera-tarjetas',
  templateUrl: 'cartera-tarjetas.html',
})
export class CarteraTarjetasPage {

  terminos: any;
  
  selectedItem: any;
  cards: Array< {holder_name: String, expiry_year: String, expiry_month: String, icon: String, number: String, card_token: String}> = [];
  

  constructor(public navCtrl: NavController,
     public storage: Storage,
      public navParams: NavParams,
       private api: ApiServiceProvider,
        public loadingCtrl: LoadingController,
          public alertCtrl: AlertController) {
    // If we navigated to this page, we will have an item available as a nav param
    let token = window.localStorage.getItem('userToken')
      console.log(token)
    this.api.getAllCards().then((data:any) => {
      this.cards = data
    })

    // Let's populate this page with some filler content for funzies
    
    

  
  }
  
   /** Añade una tarjeta de credito/debito a el cliente que se ha authenticado
   */
  addCard(){
    this.api.verifyUser().then((userInfo : any)=>{
      let value = userInfo["CEDULA"]
      this.api.addCard(value).then((result) => {
        if (result){
          this.api.getAllCards().then((data: Array< {holder_name: String, expiry_year: String, expiry_month: String, icon: String, number: String}>) => {
          let opt =  {
            cards: data
          }
          
          this.navCtrl.setRoot(CarteraTarjetasPage, opt);
          let alert = this.alertCtrl.create({
            title: 'Tarjeta Guardada',
            subTitle: 'Su tarjeta ha sido guardada con exito!',
            buttons: [{
              text: 'Ok',
              handler: () => {
                // user has clicked the alert button
                // begin the alert's dismiss transition
                alert.dismiss();
              }
            }]
            

          });
          })
        }
      })
    })
  }

  
  deleteCard(card_token){
    this.api.deleteCard(card_token).then((result) => { 

     

        this.api.getAllCards().then((data) => {
          let opt =  {
            cards: data
          }
          this.navCtrl.setRoot(CarteraTarjetasPage, opt);
        })

     
      
      
      
     })
  }

  
  cargarTerminos() {
    this.api.getTerminos()
    .then(data => {
      this.terminos = data;
      console.log(this.terminos);

      if (this.terminos[0].aceptado == false){

      
      
        let alert = this.alertCtrl.create({
          title: "Términos y Condiciones de Uso",
          
          message: this.terminos[0].descripcion,
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: () => { 
                var newTerm = {
                  idTer : 1,
                  descripcion : this.terminos[0].descripcion,
                  aceptado : true,
                };
                this.aceptarTerminos(newTerm);
              }    
            },
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => { 
                this.goPage();
                
              }
          }
        ]
        });
        alert.present();

      }
      });  
  }

  goPage(){
    this.navCtrl.setRoot(CarritoPage)
  }

  async aceptarTerminos(terminos){
    await this.api.setTerminos(terminos);
  }

  ionViewDidLoad() {
    this.cargarTerminos()
    console.log('ionViewDidLoad CarteraTarjetasPage');
    console.log(this.cards);
    //this.addCard();
   
  }

}
