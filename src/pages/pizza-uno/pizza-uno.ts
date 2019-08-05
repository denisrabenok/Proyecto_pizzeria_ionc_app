import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, Tabs, App, AlertController, ToastController, Slides, Platform, Checkbox } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { PizzaPromo } from "../../interfaces/IPizzaPromo";
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';
import { IngredientesPromoPage } from '../ingredientes-promo/ingredientes-promo';
import { PizzaDosPage } from '../pizza-dos/pizza-dos';
import { IngredientesPromo } from '../../interfaces/IIngredientesPromo';
import { CombinacionesPage } from '../combinaciones/combinaciones';

@IonicPage()
@Component({
  selector: 'page-pizza-uno',
  templateUrl: 'pizza-uno.html',
})
export class PizzaUnoPage {
  @ViewChild('tabs') tabRef: Tabs;

  ingredientes: Array<IngredientesPromo>;
  public pizzas = [];
  public promocionales = [];
  ingredientesUno: Array<IngredientesPromo>;
  public tamanos: any;
  objetivo: String;
  tamanoElegido: any;
  public tamanoSeleccion: any;
  ingredientesTab = IngredientesPromoPage;
  ingredientesParams = {};
  ingredientesEnabled: boolean;
  diaPromo: string;
  costoCombo: number;
  tamanoEnvio: number;
  objt: String;
  ingredientesCont = [];
  combos = [];
  combo = [];

  pizzaUno: PizzaPromo = { ingredientes: [], nombre: null, descripcion: "Pizza combo promocional", imgUrl: null, tamano: null, costo: null, cantidad: 1 };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public httpRequest: HttpRequestProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public events: Events,
    public toastCtrl: ToastController,
  ) {
    this.combos = this.navParams.get("combos");
    console.log(this.combos);
  }

  ionViewDidLoad() {
    this.combos = this.navParams.get("combos");
    console.log(this.combos)
    this.diaPromo = this.navParams.get("promo");
    this.combos = this.navParams.get("combo");
    this.combos = this.navParams.get("combos");
    console.log(this.combos);
    this.cargarTamanos();
    //this.escucharEventos();
    this.objetivo = this.navParams.get("objetivo");
    this.objt = "pizzaPromo";
    //this.cargarIngredientes();
    this.events.subscribe('cambio-tamano', (tamano: any) => {
      this.cargarIngredientes();
    });
  }

  obtenerIndexTamano(tamanoNombre: string) {
    for (let index = 0; index < this.tamanos.length; index++) {
      const element = this.tamanos[index];
      if (element["nombre"] == tamanoNombre) {
        console.log("econtrado")
        return index
      }
    }
    console.log("no encontrado")
    return undefined;
  }

  cargarTamanos() {
    try {
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getTamanosUrl(token)).then((data: any) => {
        var response = data.json();
        console.log(response)
        let lista = [];
        if (response["TAMANOS"] != undefined) {
          /* lista.push(response["TAMANOS"][0]);
           lista.push(response["TAMANOS"][1]);
           lista.push(response["TAMANOS"][2]);
           console.log (lista)*/
          if (response["TAMANOS"][0].NOMBRE == 'Mediana') {
            lista.push({ "id": response["TAMANOS"][0].ID, "nombre": response["TAMANOS"][0].NOMBRE, "nombreBase": response["TAMANOS"][0].NOMBRE_BASE });
          }
          if (response["TAMANOS"][1].NOMBRE == 'Familiar') {
            lista.push({ "id": response["TAMANOS"][1].ID, "nombre": response["TAMANOS"][1].NOMBRE, "nombreBase": response["TAMANOS"][1].NOMBRE_BASE });
          }
          if (response["TAMANOS"][2].NOMBRE == 'Extra grande') {
            lista.push({ "id": response["TAMANOS"][2].ID, "nombre": response["TAMANOS"][2].NOMBRE, "nombreBase": response["TAMANOS"][2].NOMBRE_BASE });
          }
          // if(response["TAMANOS"][0].NOMBRE =='Mediana' && response["TAMANOS"][1].NOMBRE=='Familiar' && response["TAMANOS"][2].NOMBRE =='Extra Grande'){
          //response["TAMANOS"].forEach(tamano => {           
          // lista.push({ "id": tamano.ID, "nombre": tamano.NOMBRE, "nombreBase": tamano.NOMBRE_BASE });           
          //})
          //}   
          this.tamanos = lista;
           //Miercoles
          if (this.diaPromo == this.combos[1].NOMBRE) {
            this.tamanoElegido = this.tamanos[2];
            this.pizzaUno.tamano = this.tamanos[2];
            this.cargarIngredientes();
          }
          //Jueves
          if (this.diaPromo == this.combos[2].NOMBRE) {
            this.tamanoElegido = this.tamanos[1];
            this.pizzaUno.tamano = this.tamanos[1];
            this.cargarIngredientes();
          }
          //Viernes
          if (this.diaPromo == this.combos[3].NOMBRE) {
            this.tamanoElegido = this.tamanos[0];
            this.pizzaUno.tamano = this.tamanos[0];
            this.cargarIngredientes();
          }
          //Sabados y Domingo
          if (this.diaPromo == this.combos[4].NOMBRE) {
            this.tamanoElegido = this.tamanos[0];
            this.pizzaUno.tamano = this.tamanos[0];
            this.cargarIngredientes();
          }
         /* if (this.diaPromo == 'Ultra Pack Dominguero') {
            this.tamanoElegido = this.tamanos[0];
            this.pizzaUno.tamano = this.tamanos[0];
            this.cargarIngredientes();
          }
          if (this.diaPromo == 'Jueves Sorpresa') {
            this.tamanoElegido = this.tamanos[1];
            this.pizzaUno.tamano = this.tamanos[1];
            this.cargarIngredientes();
          }
          if (this.diaPromo == 'Miercoles Tripleta') {
            this.tamanoElegido = this.tamanos[2];
            this.pizzaUno.tamano = this.tamanos[2];
            this.cargarIngredientes();
          }
          if (this.diaPromo == 'Sabado Tetra') {
            this.tamanoElegido = this.tamanos[0];
            this.pizzaUno.tamano = this.tamanos[0];
            this.cargarIngredientes();
          }
          this.ingredientesParams = { tamano: this.tamanoElegido };*/
        } else {
          if (response["STATUS"] != 'OK') {
            this.cerrarPagina();
          }
        }
      }, (err) => {
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION, "cerrar");
      });
    }
    catch (err) {
      console.log('Error: ', err.message);
    }
  }

  mostrarMensaje(titulo: string, mensaje: string, cerrar?) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            if (cerrar != undefined)
              this.app.getRootNavs()[0].setRoot(HomePage)
          }
        }
      ]
    });
    alert.present();
  }

  cerrarPagina() {
    let alert = this.alertCtrl.create({
      title: 'Algo ha salido mal',
      message: 'Lo sentimos, estamos teniendo inconvenientes, por favor intentalo nuevamente',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            if (this.objetivo != null) {
              this.app.getRootNavs()[0].pop();
            } else {
              this.navCtrl.setRoot(HomePage)
            }
          }
        }
      ]
    });
    alert.present();
  }


  ingredienteProm(ingrediente: IngredientesPromo) {
    if (ingrediente.checked == true) {
      console.log(this.ingredientesCont);
      if (this.ingredientesCont.length > 2) {
        this.presentAlerta("Ingredientes excedidos", "Solo se puede elegir 2 ingredientes", "ingrediente.checked = false;");
        ingrediente.checked = false;
        console.log(ingrediente)
        return;
      }
    } else if (ingrediente.checked == false) {
      this.removeItemFromArr(this.ingredientesCont, ingrediente);
      console.log(this.ingredientesCont);
    }
  }

  presentAlerta(title: string, mensaje: string, par: string) {
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

  removeItemFromArr(arr, item) {
    var i = arr.indexOf(item);
    if (i !== -1) {
      arr.splice(i, 1);
    }
  }


  escucharEventos() {
    /* captura de evento de seleccion de ingredientes cuando son agregados por primera vez o con un cambio de porcion */
    this.events.subscribe('seleccion-ingrediente', (ingrediente: IngredientesPromo) => {
      var ingredienteIndex
      if (ingrediente.checked == true) {
        if (this.pizzaUno.ingredientes.length > 1) {
          //this.pizzaUno.ingredientes[0].checked = false;
          this.presentAlert("Ingredientes excedidos", "Solo puede elegir dos ingredientes");
          return;
        } else {
          if (this.pizzaUno.ingredientes.filter(function (e, index) { return e.id === ingrediente.id; }).length > 0) { //si ya contiene el elemento
            ingredienteIndex = this.pizzaUno.ingredientes.map(function (x) { return x.id; }).indexOf(ingrediente.id);
            this.pizzaUno.ingredientes[ingredienteIndex] = ingrediente;                                               //se reemplaza
          } else {
            this.pizzaUno.ingredientes.push(ingrediente);                                                              //se agrega
          }
        }
        console.log(this.pizzaUno.ingredientes)
      } else {
        this.removeItemFromArr(this.pizzaUno.ingredientes, ingrediente);

      }
    });
  }

  terminarEventos() {
    this.events.unsubscribe('seleccion-ingrediente');
  }

  /*Eliminar todas las suscripciones*/
  ngOnDestroy() {
    this.events.unsubscribe('seleccion-ingrediente');
    this.events.unsubscribe('carga-completa');
  }


  /**
   * Este metodo se ejecutara cuando se seleccione una opcion del select
   * @param tamano contendra el objeto elegido del select */
  cambioTamano(tamano) {
    /* reiniciar los valores*/
    this.pizzaUno.ingredientes = [];
    this.ingredientesCont = [];
    this.ingredientesEnabled = false;
    this.pizzaUno.tamano = tamano;
    console.log(this.pizzaUno.tamano)
    /* Publica un evento que indica que se ha cambiado el tamano
       este evento sera escuchado por los tabs para actualizar los valores
    */
    this.events.publish('cambio-tamano', tamano);
  }


  presentAlert(title: string, mensaje: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        }
      ]
    });
    alert.present();
  }

  editarPizzas() {
    if (this.objetivo == 'editar-pizza') {
      let combo = this.navParams.get("combo");
      this.promocionales = this.navParams.get("promocionales"); //pizza que se quiere editar
      this.ingredientesEnabled = true;
      this.promocionales.forEach((pizzaUno) => {
        this.promocionales[0]["ingredientes"] = this.pizzaUno.ingredientes;
        console.log(this.promocionales[0]['ingredientes']);
        //this.pizzaUno.ingredientes = pizzaUno.ingredientes;
        if (pizzaUno.ingredientes.length < 2) {
          this.presentAlert('Faltan ingredientes', 'Por favor selecciona 2 ingrediente');
        }
        else {
          console.log(combo)
          this.navCtrl.push(CombinacionesPage, {
            promocionales: this.promocionales,
            promo: this.diaPromo,
            costo: this.costoCombo,
            opcional: this.objt,
            combo: combo
          });
        }
      });
    }
    this.terminarEventos();
  }


  cargarIngredientes() {
    let tamanos = this.tamanoElegido;
    /*let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();*/
    this.ingredientes = new Array<IngredientesPromo>();
    try {
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getTamanosIngredientesUrl(token, tamanos.id)).then((data: any) => {
        var response = data.json();
        if (response["INGREDIENTES"] != undefined) {
          response["INGREDIENTES"].forEach((child: any) => {
            let ingrediente: IngredientesPromo = {
              id: child.ID,
              nombre: child.NOMBRE,
              descripcion: child.DESCRIPCION,
              imagenUrl: child.IMAGEN_URL,
              checked: false,
              seleccion: null
            }
            this.ingredientes.push(ingrediente);
          });
          /* avisa que ya se ha terminado de cargar los bordes, para recibir cualquier pizza que se desee editar */
          this.events.publish('carga-completa', "ingredientes");
          //loading.dismiss();

        } else {
          //loading.dismiss();
          if (response["STATUS"] != 'OK') {
            this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
          }
        }
      });
    }
    catch (err) {
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }
  }

  handlerCheckbox(ingrediente: IngredientesPromo) {
    if (ingrediente.checked == true) {
      this.ingredientesCont.push(ingrediente);
      this.bloquearAdiccionIngredientes(this.ingredientes);
    } else if (ingrediente.checked == false) {
      this.removeItemFromArr(this.ingredientesCont, ingrediente);
      this.bloquearAdiccionIngredientes(this.ingredientes);
    }
  }

  bloquearAdiccionIngredientes(ingredientes) {
    ingredientes.forEach(ingrediente => {
      if (this.ingredientesCont.length == 0 || this.ingredientesCont.length == 1) {
        ingrediente.seleccion = false;
      }
      else if (this.ingredientesCont.length == 2 && ingrediente.checked == true) {
        ingrediente.seleccion = false;
      } else {
        ingrediente.seleccion = true;
      }
    });
  }


  eventoSeleccion() {
    this.ingredientesCont.forEach(ingrediente => {
      this.pizzaUno.ingredientes.push(ingrediente);
    });
  }
  eventoPublicar() {
    this.events.subscribe('seleccion-ingrediente', (ingrediente: IngredientesPromo) => {
      if (ingrediente.checked == true) {
        this.events.publish('seleccion-ingrediente', ingrediente);
      }
    });
  }

  siguiente() {
    this.eventoSeleccion();
    if (this.pizzaUno.ingredientes.length == 1) {
      this.presentAlert('Faltan ingredientes', 'Por favor selecciona un ingrediente más');
      return;
    } else if (this.pizzaUno.ingredientes.length == 0) {
        this.presentAlert('Faltan ingredientes', 'No has seleccionado ningún ingrediente');
        return;
      }
      else {
        this.eventoPublicar();
        this.pizzaUno.nombre = "Pizza Uno";
        //Martes y Miercoles
        if (this.diaPromo == this.combos[1].NOMBRE || this.diaPromo == this.combos[2].NOMBRE) {
          this.costoCombo = this.navParams.get('costo');
          this.pizzaUno.costo = this.costoCombo / 3;
          this.tamanoEnvio = this.pizzaUno.tamano;
        }
        //Domingo
        if (this.diaPromo == this.combos[4].NOMBRE) {
          if (this.tamanoElegido == this.tamanos[0]) {
            this.tamanoEnvio = this.pizzaUno.tamano;
            this.costoCombo = 19.99
          }
          if (this.tamanoElegido == this.tamanos[1]) {
            this.tamanoEnvio = this.pizzaUno.tamano;
            this.costoCombo = 25.99
          }
          if (this.tamanoElegido == this.tamanos[2]) {
            this.tamanoEnvio = this.pizzaUno.tamano;
            this.costoCombo = 31.99
          }
          this.pizzaUno.costo = this.costoCombo / 3;
        }
        //Sabado
        if (this.diaPromo == this.combos[3].NOMBRE) {
          this.costoCombo = this.navParams.get('costo');
          this.pizzaUno.costo = this.costoCombo / 4;
          this.tamanoEnvio = this.pizzaUno.tamano;
        }

        this.combo = this.navParams.get("combo");
        console.log(this.combo)
        this.combo['PIZZAS'].push(this.pizzaUno);

       // let combo = this.navParams.get("combo");
        this.navCtrl.push(PizzaDosPage, {
          pizzas: this.pizzaUno,
          promo: this.diaPromo,
          costo: this.costoCombo,
          tamanoPizza: this.tamanoEnvio,
          combo: this.combo,
          combos : this.combos
        });
        this.terminarEventos();
      }
  }


  @ViewChild("tabs") tabs: Tabs;
  @ViewChild(Slides) slides: Slides;
}
