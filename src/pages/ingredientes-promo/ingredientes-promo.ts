import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, App, AlertController } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { IngredientesPromo } from "../../interfaces/IIngredientesPromo";
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-ingredientes-promo',
  templateUrl: 'ingredientes-promo.html',
})
export class IngredientesPromoPage {

  ingredientes: Array<IngredientesPromo>;
  porciones = [];
  ingredientesCont = [];
  tradicionales = [];
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public httpRequest: HttpRequestProvider,
    public events: Events,
    public loadingCtrl: LoadingController,
    public app: App,
    public alertCtrl: AlertController
  ) {

    /* suscripcion de evento para edicion de pizzas creadas con anterioridad */
    this.events.subscribe("pizza", (pizza) => {
      if (pizza.ingredientes.length > 0) {
        let ingredientes = pizza.ingredientes;
        ingredientes.forEach(ingrediente => {
          let index = this.ingredientes.map(function (x) { return x.id; }).indexOf(ingrediente.id);
          console.log(ingrediente)
          this.ingredientes[index] = ingrediente;
        });
      }
    });
  }

  /** Este metodo sera llamado cada que se ingrese al tab */
  ionViewDidLoad() {
    this.cargarPorciones();
    /* Se suscribe al evento publicado por crear-pizza para actualizar los valores cuando el tamano
      escogido cambie */
    this.events.subscribe('cambio-tamano', (tamano: any) => {
      this.cargarIngredientes();
    });
  }

  ionViewWillEnter() {
    this.events.publish('tab-activo', "ingredientes");
  }

  ionViewWillLeave(){
    if(this.ingredientesCont !=null){
      this.ingredientesCont.forEach(ingrediente => {
        this.events.publish('seleccion-ingrediente', ingrediente);
      });
    }
  }

  ngOnDestroy() {
    this.events.unsubscribe('cambio-tamano');
    this.events.unsubscribe("pizza");

  }

  /**
   * Este metodo carga todas los ingredientes a traves de un servicio web en base a un tamanao especifico
   * @param tamano tamano de los ingredientes */

  cargarIngredientes() {
    let tamanos = this.navParams.get("tamano");
    console.log(tamanos)
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();
    this.ingredientes = new Array<IngredientesPromo>();
    try {
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getTamanosIngredientesUrl(token, tamanos.id)).then((data: any) => {
        var response = data.json();
        console.log(response)
        console.log(response["INGREDIENTES"])
        if (response["INGREDIENTES"] != undefined) {
          response["INGREDIENTES"].forEach((child: any) => {
            let porcionesJson = JSON.parse(JSON.stringify(this.porciones));   //se crea una para no alterar el arreglo original
            /*Se agrega el campo id a cada porcion, para poder identificar a que ingrediente 
            modificar el costo cuando se elija una porcion*/
            let porciones = [];
            let ingrediente: IngredientesPromo = {
              id: child.ID,
              nombre: child.NOMBRE,
              descripcion: child.DESCRIPCION,
              imagenUrl: child.IMAGEN_URL,
              //.   porciones : porciones,
              checked: false,
              seleccion: null
            }
            this.ingredientes.push(ingrediente);
          });
          /* avisa que ya se ha terminado de cargar los bordes, para recibir cualquier pizza que se desee editar */
          this.events.publish('carga-completa', "ingredientes");
          loading.dismiss();

        } else {
          loading.dismiss();
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

  mostrarMensaje(titulo: string, mensaje: string) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            this.app.getRootNavs()[0].setRoot(HomePage)
          }
        }
      ]
    });
    alert.present();
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

  async cargarPorciones() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();
    try {
      let token = window.localStorage.getItem("userToken");
      await this.httpRequest.get(Constantes.getPorcionesUrl(token)).then((data: any) => {
        var response = data.json();
        console.log(response)
        if (response["PORCIONES"] != undefined) {
          response["PORCIONES"].forEach(porcion => {
            this.porciones.push({ "id": porcion.ID, "nombre": porcion.NOMBRE, "valor": porcion.VALOR });
          });
          loading.dismiss();
          var tamano = this.navParams.get("tamano");
          console.log(tamano);
          this.cargarIngredientes();
        } else {
          loading.dismiss();
          if (response["STATUS"] != 'OK') {
            console.log(response["DETALLE"])
            this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
          }
        }
      });
    }
    catch (err) {
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }

  }

  /**
   * Este metodo se ejecutara cuando se seleccione una
   * opcion del select
   * @param porcion contendra el objeto elegido del select
   */
  cambioPorcion(ingrediente: IngredientesPromo) {
    if (ingrediente.checked) {
      this.events.publish('seleccion-ingrediente', ingrediente);
    }

  }

  /* Este metodo procesara la accion de seleccionar un ingrediente
  * @param ingrediente  ingrediente que captura el evento del checkbox */
  handlerCheckbox(ingrediente: IngredientesPromo) {
    if (ingrediente.checked==true){
      this.ingredientesCont.push(ingrediente);
      console.log(this.ingredientesCont);
        if(this.ingredientesCont.length > 2 ){
          this.presentAlert("Ingredientes excedidos","Solo se puede elegir 2 ingredientes", "ingrediente.checked = false;");      
          ingrediente.checked = false;
           console.log(ingrediente)
            return;
        } else {
          this.events.publish('seleccion-ingrediente', ingrediente);
        }
       } else if (ingrediente.checked == false){
          this.removeItemFromArr(this.ingredientesCont, ingrediente);
          this.events.unsubscribe('seleccion-ingrediente');
       }
    }
    
    removeItemFromArr(arr, item) {
      var i = arr.indexOf(item);
      if (i !== -1) {
        arr.splice(i, 1);
      }
    }
}
