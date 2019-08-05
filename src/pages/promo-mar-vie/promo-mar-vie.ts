import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, Events } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { PizzaTradicional } from "../../interfaces/IPizzaTradicional";
import { CombinacionesPage } from '../combinaciones/combinaciones';


@IonicPage()
@Component({
  selector: 'page-promo-mar-vie',
  templateUrl: 'promo-mar-vie.html',
})
export class PromoMarViePage {
  public pizzasSilver: Array<PizzaTradicional> = new Array<PizzaTradicional>();
  public pizzasGolden: Array<PizzaTradicional> = new Array<PizzaTradicional>();
  public pizzasPlatinum: Array<PizzaTradicional> = new Array<PizzaTradicional>();
  pizzaSilverLo = [];
  pizzaGoldLo = [];
  pizzaPlatinumLo = [];
  tradicionalesPromo = [];
  costoPizza: number;

  bloquearSilver: boolean;
  bloquearGold: boolean;
  bloquearPlatinum: boolean;
  combo = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public httpRequest: HttpRequestProvider,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public events: Events,
    public alertCtrl: AlertController) {
    this.obtenerPizzasSilver();
    this.obtenerPizzasGolden();
    this.obtenerPizzasPlatinum();
    this.costoPizza = this.navParams.get("costo");
    console.log(this.pizzasSilver);
    this.pizzaSilverLo.forEach(pizzaProm => {
      if(pizzaProm.checked == null ||  pizzaProm.checked==false){
        this.removeItemFromArr(this.pizzaSilverLo, pizzaProm);
        console.log(this.pizzaGoldLo);
      }
     });
     this.pizzaGoldLo.forEach(pizzaProm => {
      if(pizzaProm.checked == null ||  pizzaProm.checked==false){
        this.removeItemFromArr(this.pizzaGoldLo, pizzaProm);
        console.log(this.pizzaGoldLo);
      }
     });
     this.pizzaPlatinumLo.forEach(pizzaProm => {
      if(pizzaProm.checked == null ||  pizzaProm.checked==false){
        this.removeItemFromArr(this.pizzaPlatinumLo, pizzaProm);
        console.log(this.pizzaGoldLo);
      }
     });
     this.combo = this.navParams.get("combo")
     console.log(this.combo)
  }


  obtenerPizzasSilver() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();
    if (window.localStorage.getItem("userToken") != null) {
      console.log(Constantes.getTradicionalesUrl(window.localStorage.getItem("userToken")))
      this.httpRequest.get(Constantes.getTradicionalesUrl(window.localStorage.getItem("userToken"))).then((data: any) => {
        var response = data.json();
        console.log(response);
        if (response.STATUS == "OK") {
          response.PIZZAS.forEach(pizzaProm => {
            if (pizzaProm.TAMANO == 'Silver') {
              let pizzaSilver: PizzaTradicional = {
                id: pizzaProm.ID,
                nombre: pizzaProm.NOMBRE,
                descripcion: pizzaProm.DESCRIPCION,
                imgUrl: pizzaProm.IMAGEN_URL,
                favorita: pizzaProm.FAVORITA,
                masa: null,
                borde: null,
                ingredientes: null,
                tamano: pizzaProm.TAMANO,
                cantidad: 1,
                costo: pizzaProm.COSTO,
                checked: null,
                seleccion: null
              }
              this.pizzasSilver.push(pizzaSilver);
            }
          });
        }
        loading.dismiss();
      }, (error: any) => {
        console.log("Error");
        loading.dismiss();
      });
    }
  }

  obtenerPizzasGolden() {
    if (window.localStorage.getItem("userToken") != null) {
      console.log(Constantes.getTradicionalesUrl(window.localStorage.getItem("userToken")))
      this.httpRequest.get(Constantes.getTradicionalesUrl(window.localStorage.getItem("userToken"))).then((data: any) => {
        var response = data.json();
        console.log(response);
        if (response.STATUS == "OK") {
          response.PIZZAS.forEach(pizzaProm => {
            if (pizzaProm.TAMANO == 'Gold') {

              //var child = response.PIZZAS[key];
              let pizzasGolden: PizzaTradicional = {
                id: pizzaProm.ID,
                nombre: pizzaProm.NOMBRE,
                descripcion: pizzaProm.DESCRIPCION,
                imgUrl: pizzaProm.IMAGEN_URL,
                favorita: pizzaProm.FAVORITA,
                masa: null,
                borde: null,
                ingredientes: null,
                tamano: pizzaProm.TAMANO,
                cantidad: 1,
                costo: pizzaProm.COSTO,
                checked: null,
                seleccion: null
              }
              this.pizzasGolden.push(pizzasGolden);
            }
          });
        }
      }, (error: any) => {
        console.log("Error");
      });
    }
  }

  obtenerPizzasPlatinum() {
    if (window.localStorage.getItem("userToken") != null) {
      console.log(Constantes.getTradicionalesUrl(window.localStorage.getItem("userToken")))
      this.httpRequest.get(Constantes.getTradicionalesUrl(window.localStorage.getItem("userToken"))).then((data: any) => {
        var response = data.json();
        console.log(response);
        if (response.STATUS == "OK") {
          response.PIZZAS.forEach(pizzaProm => {
            if (pizzaProm.TAMANO == 'Platinum') {

              //var child = response.PIZZAS[key];
              let pizzasPlatinum: PizzaTradicional = {
                id: pizzaProm.ID,
                nombre: pizzaProm.NOMBRE,
                descripcion: pizzaProm.DESCRIPCION,
                imgUrl: pizzaProm.IMAGEN_URL,
                favorita: pizzaProm.FAVORITA,
                masa: null,
                borde: null,
                ingredientes: null,
                tamano: pizzaProm.TAMANO,
                cantidad: 1,
                costo: pizzaProm.COSTO,
                checked: null,
                seleccion: null
              }
              this.pizzasPlatinum.push(pizzasPlatinum);
            }
          });
        }
      }, (error: any) => {
        console.log("Error");
      });
    }
  }

  handlerCheckboxUno(pizza: PizzaTradicional) {
    let nombre = pizza.nombre;

    if (pizza.checked == true) {
      pizza.costo = this.costoPizza / 3;
      this.pizzaSilverLo.push(pizza);
    } 
    
    if(pizza.checked == false){
      this.pizzasSilver.forEach(pizzaProm => {
        if(pizzaProm.checked==false || pizzaProm.checked==null){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
        }
       });
       this.pizzasGolden.forEach(pizzaProm => {
        if(pizzaProm.checked==false || pizzaProm.checked==null){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
        }
       });
       this.pizzasPlatinum.forEach(pizzaProm => {
        if(pizzaProm.checked==false || pizzaProm.checked==null){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
        }
       });

       this.pizzaSilverLo.forEach(pizzaProm => {
        if(pizzaProm.nombre==nombre){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
          pizzaProm.cantidad = 1;        
        }
        if(pizzaProm.checked == null  ||  pizzaProm.checked==false){
          this.removeItemFromArr(this.pizzaSilverLo, pizzaProm);
        }
       }); 
    }
    this.pizzaSilverLo.forEach(pizzaProm => {
      if(pizzaProm.checked == null ||  pizzaProm.checked==false){
        this.removeItemFromArr(this.pizzaSilverLo, pizzaProm);
      }
     }); 
     if(this.pizzaSilverLo.length ==0){
       this.pizzaSilverLo = [];
     }
    this.bloquearSeleccionSilver(this.pizzasSilver);
    this.bloquearSeleccionGold(this.pizzasGolden);
    this.bloquearSeleccionPlatinum(this.pizzasPlatinum);
    this.bloquearAdicionSilver();
    this.bloquearAdicionGold();
    this.bloquearAdicionPlatinum();
    console.log(this.pizzaSilverLo)
  }


  handlerCheckboxDos(pizza: PizzaTradicional) {
    let nombre = pizza.nombre;
    if (pizza.checked == true) {
      pizza.costo = this.costoPizza / 3;
      this.pizzaGoldLo.push(pizza);
    }
    
    if(pizza.checked == false){
      this.pizzasSilver.forEach(pizzaProm => {
        if(pizzaProm.checked==false || pizzaProm.checked==null){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
        }
       });
       this.pizzasGolden.forEach(pizzaProm => {
        if(pizzaProm.checked==false || pizzaProm.checked==null){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
        }
       });
       this.pizzasPlatinum.forEach(pizzaProm => {
        if(pizzaProm.checked==false || pizzaProm.checked==null){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
        }
       });

       this.pizzaGoldLo.forEach(pizzaProm => {
        if(pizzaProm.nombre==nombre){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
          pizzaProm.cantidad = 1;     
        }
        if(pizzaProm.checked == null ||  pizzaProm.checked==false){
          this.removeItemFromArr(this.pizzaGoldLo, pizzaProm);
        }
       });
    }

    this.pizzaGoldLo.forEach(pizzaProm => {
      if(pizzaProm.checked == null ||  pizzaProm.checked==false){
        this.removeItemFromArr(this.pizzaGoldLo, pizzaProm);
      }
     });
     if(this.pizzaGoldLo.length ==0){
      this.pizzaGoldLo = [];
    }
    this.bloquearSeleccionSilver(this.pizzasSilver);
    this.bloquearSeleccionGold(this.pizzasGolden);
    this.bloquearSeleccionPlatinum(this.pizzasPlatinum);
    this.bloquearAdicionSilver();
    this.bloquearAdicionGold();
    this.bloquearAdicionPlatinum();
    console.log(this.pizzaGoldLo)
  }

  handlerCheckboxTres(pizza: PizzaTradicional) {
    let nombre = pizza.nombre;
    if (pizza.checked == true) {
      pizza.costo = this.costoPizza / 3;
      this.pizzaPlatinumLo.push(pizza);
    }

    if(pizza.checked == false){
      this.pizzasSilver.forEach(pizzaProm => {
        if(pizzaProm.checked==false || pizzaProm.checked==null){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
        }
       });
       this.pizzasGolden.forEach(pizzaProm => {
        if(pizzaProm.checked==false || pizzaProm.checked==null){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
        }
       });
       this.pizzasPlatinum.forEach(pizzaProm => {
        if(pizzaProm.checked==false || pizzaProm.checked==null){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
        }
       });

       this.pizzaPlatinumLo.forEach(pizzaProm => {
        if(pizzaProm.nombre==nombre){  
          pizzaProm.checked = null;
          pizzaProm.seleccion = null;
          pizzaProm.cantidad = 1;        
        }
        if(pizzaProm.checked == null ||  pizzaProm.checked==false){
          this.removeItemFromArr(this.pizzaPlatinumLo, pizzaProm);
        }
       }); 
    }

    this.pizzaPlatinumLo.forEach(pizzaProm => {
      if(pizzaProm.checked == null ||  pizzaProm.checked==false){
        this.removeItemFromArr(this.pizzaPlatinumLo, pizzaProm);
      }
     });
     if(this.pizzaPlatinumLo.length ==0){
      this.pizzaPlatinumLo = [];
    }
    this.bloquearSeleccionSilver(this.pizzasSilver);
    this.bloquearSeleccionGold(this.pizzasGolden);
    this.bloquearSeleccionPlatinum(this.pizzasPlatinum);
    this.bloquearAdicionSilver();
    this.bloquearAdicionGold();
    this.bloquearAdicionPlatinum();
    console.log(this.pizzaPlatinumLo)
  }

  disminuirCantidadSilver(pizza){
    pizza.cantidad--;
    this.removeItemFromArr(this.pizzaSilverLo, pizza);
    this.bloquearAdicionSilver();
    this.bloquearAdicionGold();
    this.bloquearAdicionPlatinum();
    this.bloquearSeleccionSilver(this.pizzasSilver);
    this.bloquearSeleccionGold(this.pizzasGolden);
    this.bloquearSeleccionPlatinum(this.pizzasPlatinum);
    
    //this.handlerCheckbox(pizza);
  }

  disminuirCantidadGold(pizza){
    pizza.cantidad--;
    this.removeItemFromArr(this.pizzaGoldLo, pizza);
    this.bloquearAdicionSilver();
    this.bloquearAdicionGold();
    this.bloquearAdicionPlatinum();
    this.bloquearSeleccionSilver(this.pizzasSilver);
    this.bloquearSeleccionGold(this.pizzasGolden);
    this.bloquearSeleccionPlatinum(this.pizzasPlatinum);
  }

  disminuirCantidadPlatinum(pizza){
    pizza.cantidad--;
    this.removeItemFromArr(this.pizzaPlatinumLo, pizza);
    this.bloquearAdicionSilver();
    this.bloquearAdicionGold();
    this.bloquearAdicionPlatinum();
    this.bloquearSeleccionSilver(this.pizzasSilver);
    this.bloquearSeleccionGold(this.pizzasGolden);
    this.bloquearSeleccionPlatinum(this.pizzasPlatinum);
  }
  
  aumentarCantidadSilver(pizza) {
    pizza.cantidad++;
    this.pizzaSilverLo.push(pizza);
    console.log(this.pizzaSilverLo)
    //this.handlerCheckbox(bebida);
    this.bloquearAdicionSilver();
    this.bloquearAdicionGold();
    this.bloquearAdicionPlatinum();
    this.bloquearSeleccionSilver(this.pizzasSilver);
    this.bloquearSeleccionGold(this.pizzasGolden);
    this.bloquearSeleccionPlatinum(this.pizzasPlatinum);
  }

  aumentarCantidadGold(pizza) {
    pizza.cantidad++;
    this.pizzaGoldLo.push(pizza);
    console.log(this.pizzaGoldLo)
    //this.handlerCheckbox(bebida);
    this.bloquearAdicionSilver();
    this.bloquearAdicionGold();
    this.bloquearAdicionPlatinum();
    this.bloquearSeleccionSilver(this.pizzasSilver);
    this.bloquearSeleccionGold(this.pizzasGolden);
    this.bloquearSeleccionPlatinum(this.pizzasPlatinum);
  }

  aumentarCantidadPlatinum(pizza) {
    pizza.cantidad++;
    this.pizzaPlatinumLo.push(pizza);
    this.bloquearAdicionSilver();
    this.bloquearAdicionGold();
    this.bloquearAdicionPlatinum();
    this.bloquearSeleccionSilver(this.pizzasSilver);
    this.bloquearSeleccionGold(this.pizzasGolden);
    this.bloquearSeleccionPlatinum(this.pizzasPlatinum);
  }

  removeItemFromArr(arr, item) {
    var i = arr.indexOf(item);
    if (i !== -1) {
      arr.splice(i, 1);
    }
  }

  siguiente() {
    if(  this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 2 && this.pizzaPlatinumLo.length ==0
      || this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length ==1
      || this.pizzaSilverLo.length == 3 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length ==0
      || this.pizzaSilverLo.length == 2 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length ==0
      || this.pizzaSilverLo.length == 2 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length ==1){

        this.combo = this.navParams.get("combo");

      if (this.pizzaSilverLo != null) {
        this.pizzaSilverLo.forEach(pizza => {
          this.tradicionalesPromo.push(pizza) 
          this.combo['PIZZAS'].push(pizza);  
        });
      }
      if (this.pizzaGoldLo != null) {
        this.pizzaGoldLo.forEach(pizza => {
          this.tradicionalesPromo.push(pizza)
          this.combo['PIZZAS'].push(pizza); 
        });
      }
  
      if (this.pizzaPlatinumLo != null) {
        this.pizzaPlatinumLo.forEach(pizza => {
          this.tradicionalesPromo.push(pizza)
          this.combo['PIZZAS'].push(pizza); 
        });
      }
      console.log(this.tradicionalesPromo);
      console.log(this.combo);


      this.navCtrl.push(CombinacionesPage, {
        tradicionalPromo: this.tradicionalesPromo,
        combo: this.combo
      });
    } else {
      this.mostrarMensaje("Orden incompleta", "Elija entre las combinaciones permitidas de la promoción");
    }
  }

  presentAlert(title: string, mensaje: string, par: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            par;
          }
        }
      ]
    });
    alert.present();
  }

  bloquearAdicionSilver(){
    if(this.pizzaSilverLo.length == 3 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 0
      || this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 2 && this.pizzaPlatinumLo.length == 0
      || this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 1
      || this.pizzaSilverLo.length == 2 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 0
      || this.pizzaSilverLo.length == 2 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 1){
        this.bloquearSilver = false;
    } else{
        this.bloquearSilver = true;
    }
  }

  bloquearAdicionGold(){
    if(this.pizzaSilverLo.length == 3 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 0
      || this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 2 && this.pizzaPlatinumLo.length == 0
      || this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 1
      || this.pizzaSilverLo.length == 2 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 0
      || this.pizzaSilverLo.length == 2 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 1
      || this.pizzaSilverLo.length == 0 && this.pizzaGoldLo.length == 2 && this.pizzaPlatinumLo.length == 0
      || this.pizzaSilverLo.length == 0 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 1){
        this.bloquearGold = false;
    } else{
        this.bloquearGold = true;
    }
  }

  bloquearAdicionPlatinum(){
    if(this.pizzaSilverLo.length == 3 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 0
      || this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 2 && this.pizzaPlatinumLo.length == 0
      || this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 1
      || this.pizzaSilverLo.length == 2 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 0
      || this.pizzaSilverLo.length == 2 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 1
      || this.pizzaSilverLo.length == 0 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 1
      || this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 1
      || this.pizzaSilverLo.length == 0 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 1){
        this.bloquearPlatinum = false;
    } else{
        this.bloquearPlatinum = true;
    }
  }

  bloquearSeleccionSilver(pizza){
    pizza.forEach(pizzaProm => {
      /*if ((this.pizzaSilverLo.length == 0 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 0)
        || (this.pizzaSilverLo.length == 0 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 1)
        || (this.pizzaSilverLo.length == 0 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 0)
        || (this.pizzaSilverLo.length == 0 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 1)
        || (this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 0)
        || (this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 1)
        || (this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 0)
        || (this.pizzaSilverLo.length == 0 && this.pizzaGoldLo.length == 2 && this.pizzaPlatinumLo.length == 0)
        || (this.pizzaSilverLo.length == 2 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 0)
      ) {
        pizzaProm.seleccion = false;
      }
      else if (this.pizzaSilverLo.length == 3 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 2 && this.pizzaPlatinumLo.length == 0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length == 1 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 1 && pizzaProm.checked != null
        || this.pizzaSilverLo.length == 2 && this.pizzaGoldLo.length == 1 && this.pizzaPlatinumLo.length == 0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length == 2 && this.pizzaGoldLo.length == 0 && this.pizzaPlatinumLo.length == 1 && pizzaProm.checked != null) {
        pizzaProm.seleccion = false;
      } else {
        pizzaProm.seleccion = true;
      }*/
      if (this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==3 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==2 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==3 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
      ) {
        pizzaProm.seleccion = true;
      } else {
        pizzaProm.seleccion = false;
      }
    });
  }

  bloquearSeleccionGold(pizza){
    pizza.forEach(pizzaProm => {
     /* if (this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0
        //|| this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==2 && this.pizzaPlatinumLo.length==0
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0 
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0 
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0
      ) {
        pizzaProm.seleccion = false;
      }
      else if (
        this.pizzaSilverLo.length == 3 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked != null
        || this.pizzaSilverLo.length ==1 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==2 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==2 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked != null
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked != null) {
        pizzaProm.seleccion = false;
      } else {
        pizzaProm.seleccion = true;
      }*/
      if (this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==2 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==2 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==3 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==2 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
      ) {
        pizzaProm.seleccion = true;
      } else {
        pizzaProm.seleccion = false;
      }
    });
  }

  bloquearSeleccionPlatinum(pizza){
    pizza.forEach(pizzaProm => {
    /*  if (this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0
        //|| this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==1
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0
      ) {
        pizzaProm.seleccion = false;
      }
      else if (this.pizzaSilverLo.length == 3 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked != null
        //|| this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked != null
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked != null
        || this.pizzaSilverLo.length ==1 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked != null
        || this.pizzaSilverLo.length ==1 && this.pizzaGoldLo.length==2 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length ==1 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked != null
        || this.pizzaSilverLo.length ==1 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==2 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length ==2 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked != null
        || this.pizzaSilverLo.length ==2 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked != null) {
        pizzaProm.seleccion = false;
      } else {
        pizzaProm.seleccion = true;
      }*/
      if (this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==1 && this.pizzaGoldLo.length==2 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==3 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==0 && this.pizzaPlatinumLo.length==1 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==2 && this.pizzaGoldLo.length==1 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
        || this.pizzaSilverLo.length==0 && this.pizzaGoldLo.length==2 && this.pizzaPlatinumLo.length==0 && pizzaProm.checked == null || pizzaProm.checked == false
      ) {
        pizzaProm.seleccion = true;
      } else {
        pizzaProm.seleccion = false;
      }
    });
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
          }
        }   
      ]
    });
    alert.present();
   }
}
