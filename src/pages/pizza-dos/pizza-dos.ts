
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, Tabs, App, AlertController, ToastController, Slides, Platform } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';
import { IngredientesPromoPage } from '../ingredientes-promo/ingredientes-promo';
import { PizzaTresPage } from '../pizza-tres/pizza-tres';
import { CombinacionesPage } from '../combinaciones/combinaciones';
import { IngredientesPromo } from '../../interfaces/IIngredientesPromo';
import { PizzaPromo } from '../../interfaces/IPizzaPromo';


@IonicPage()
@Component({
  selector: 'page-pizza-dos',
  templateUrl: 'pizza-dos.html',
})
export class PizzaDosPage {

  @ViewChild('tabs') tabRef: Tabs;
  //pizzaDos  : PizzaPromo;
  
  public pizzas = [];
  public promocionales = [];
  ingredientes: Array<IngredientesPromo>;
  ingredientesCont = [];
  pizzaDos : PizzaPromo;
  tamanos : any;
  objetivo : String;
  tamanoElegido :any;
  ingredientesTab= IngredientesPromoPage;
  ingredientesParams = {};
  ingredientesEnabled : boolean;
  diaPromo: string;
  costoCombo: number;
  tamanoPizza : any;
  objt : String;
  combos = [];
  combo = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public app: App, 
    public httpRequest : HttpRequestProvider, 
    public loadingCtrl: LoadingController, 
    public alertCtrl : AlertController,
    public platform: Platform, 
    public events : Events,
    public toastCtrl: ToastController,
  ) {
    this.combos = this.navParams.get("combos");
  }

  ionViewDidLoad() { 
    //this.escucharEventos();
    this.pizzaDos = {ingredientes: [], nombre :null, descripcion : "Pizza combo promocional", imgUrl : null, tamano : null, costo: null, cantidad:1};         
    this.objetivo = this.navParams.get("objetivo");
    //this.combos = this.navParams.get("combos");
    this.pizzas.push(this.navParams.get("pizzas"));
    console.log(this.pizzas)
    this.diaPromo = this.navParams.get("promo");
    this.tamanoPizza = this.navParams.get("tamanoPizza");
    this.cargarTamanos();
    this.tamanoElegido = this.tamanoPizza;
    this.costoCombo = this.navParams.get('costo');
    
    this.ingredientesEnabled = true;
    if (this.objetivo!='editar-pizza'){
      this.pizzas.push(this.pizzaDos);
    }
    this.objt = "pizzaPromo"
  }

  obtenerIndexTamano(tamanoNombre : string){
    for (let index = 0; index < this.tamanos.length; index++) {
      const element = this.tamanos[index];
      if(element["nombre"] == tamanoNombre){
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
          if (response["TAMANOS"][0].NOMBRE == 'Mediana') {
            lista.push({ "id": response["TAMANOS"][0].ID, "nombre": response["TAMANOS"][0].NOMBRE, "nombreBase": response["TAMANOS"][0].NOMBRE_BASE });
          }
          if (response["TAMANOS"][1].NOMBRE == 'Familiar') {
            lista.push({ "id": response["TAMANOS"][1].ID, "nombre": response["TAMANOS"][1].NOMBRE, "nombreBase": response["TAMANOS"][1].NOMBRE_BASE });
          }
          if (response["TAMANOS"][2].NOMBRE == 'Extra grande') {
            lista.push({ "id": response["TAMANOS"][2].ID, "nombre": response["TAMANOS"][2].NOMBRE, "nombreBase": response["TAMANOS"][2].NOMBRE_BASE });
          }
          this.tamanos = lista; 
          
         if (this.tamanoPizza.nombre == this.tamanos[0].nombre ) {
            this.tamanoElegido = this.tamanos[0];
            this.pizzaDos.tamano = this.tamanos[0];
            this.cargarIngredientes();
          }
          if (this.tamanoPizza.nombre == this.tamanos[1].nombre ) {
            this.tamanoElegido = this.tamanos[1];
            this.pizzaDos.tamano = this.tamanos[1];
            this.cargarIngredientes();
          }
          if (this.tamanoPizza.nombre == this.tamanos[2].nombre ) {
            this.tamanoElegido = this.tamanos[2];
            this.pizzaDos.tamano = this.tamanos[2];
            this.cargarIngredientes();
          }
          //this.ingredientesParams = { tamano: this.tamanoElegido };
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

  cargarIngredientes() {
    //let tamanos = this.navParams.get("tamano");
    let tamanos = this.tamanoElegido;

   /* let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();*/
    this.ingredientes = new Array<IngredientesPromo>();
    try {
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getTamanosIngredientesUrl(token, tamanos.id)).then((data: any) => {
        var response = data.json();
        console.log(response)
        if (response["INGREDIENTES"] != undefined) {
          response["INGREDIENTES"].forEach((child: any) => {
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

  /* 
  async cargarTamanos(){
    try {
      let token = window.localStorage.getItem("userToken");
      await this.httpRequest.get(Constantes.getTamanosUrl(token)).then((data : any) => {
        var response = data.json();
        let lista = [];
        if(response["TAMANOS"] != undefined){
          response["TAMANOS"].forEach(tamano => {
            lista.push({"id": tamano.ID , "nombre":tamano.NOMBRE , "nombreBase":tamano.NOMBRE_BASE});
          });
          this.tamanos = lista;
          if (this.diaPromo == 'Ultra Pack Dominguero') {
            this.tamanoElegido = this.tamanos[this.tamanoPizza];
          }
          if (this.diaPromo == 'Jueves Sorpresa') {
            this.tamanoElegido = this.tamanos[1];
          }
          if (this.diaPromo == 'Miercoles Tripleta' || this.diaPromo == 'Sabado Tetra') {
            this.tamanoElegido = this.tamanos[2];
          }
          this.ingredientesParams = { tamano: this.tamanoElegido };
        }else{
          if(response["STATUS"] != 'OK'){
            this.cerrarPagina();
          }
        }       
      }, (err)=>{
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION,"cerrar");
      });
    }
    catch(err) {
        console.log('Error: ', err.message);
    }
  } */

  mostrarMensaje(titulo: string ,mensaje: string , cerrar?){
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            if(cerrar != undefined )
              this.app.getRootNavs()[0].setRoot(HomePage)       
          }
        }      
      ]
    });
    alert.present();
   }

 cerrarPagina(){
  let alert = this.alertCtrl.create({
    title: 'Algo ha salido mal',
    message: 'Lo sentimos, estamos teniendo inconvenientes, por favor intentalo nuevamente',
    buttons: [
      {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          if(this.objetivo != null){
            this.app.getRootNavs()[0].pop();
          }else{
            this.navCtrl.setRoot(HomePage)
          }
        }
      }
    ]
  });
  alert.present();
 }
   
  escucharEventos(){
     /* captura de evento de seleccion de ingredientes cuando son agregados por primera vez o con un cambio de porcion */
    this.events.subscribe('seleccion-ingrediente', (ingrediente : IngredientesPromo) => {
      var ingredienteIndex  
      if(ingrediente.checked){
        if(this.pizzaDos.ingredientes.length > 1){
          this.ingredientesEnabled = false;
          ingrediente.checked = false;
           this.presentAlert("Ingredientes excedidos", "Solo puede elegir dos ingredientes");
           return;
          } else {
          if (this.pizzaDos.ingredientes.filter(function(e ,index) { return e.id === ingrediente.id ; }).length > 0) { //si ya contiene el elemento
            ingredienteIndex = this.pizzaDos.ingredientes.map(function (x) { return x.id; }).indexOf(ingrediente.id);
            this.pizzaDos.ingredientes[ingredienteIndex] = ingrediente;                                               //se reemplaza
          }else{     
            this.pizzaDos.ingredientes.push(ingrediente);                                                              //se agrega
          }
        }     
      }else{                                                                                                        //se quita de la lista
          ingredienteIndex = this.pizzaDos.ingredientes.map(function (x) { return x.id; }).indexOf(ingrediente.id);
          this.pizzaDos.ingredientes.splice(ingredienteIndex,1 );
        }
    }); 
  }

  /* Eliminar todas las suscripciones */
  ngOnDestroy(){
    this.events.unsubscribe('seleccion-ingrediente');
    this.events.unsubscribe('carga-completa');
  }


  /**
   * Este metodo se ejecutara cuando se seleccione una opcion del select
   * @param tamano contendra el objeto elegido del select
   */
  cambioTamano(tamano) {    
    /* reiniciar los valores*/
    this.pizzaDos.ingredientes = [];
    this.ingredientesEnabled = false;
    this.tabRef.select(0, { animate: true });
    this.pizzaDos.tamano = tamano;
    /* Publica un evento que indica que se ha cambiado el tamano
       este eveno sera escuchado por los tabs para actualizar los valores
    */
    this.events.publish('cambio-tamano', tamano);
  }

  presentAlert(title: string, mensaje:string) {
    let alert = this.alertCtrl.create({
      title: title,
      //'Faltan los Ingredientes',
      message: mensaje,
      //'Por favor selecciona al menos 1 ingrediente',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',    
        }   
      ]
    });
    alert.present();
  }
  terminarEventos(){
    this.events.unsubscribe('seleccion-ingrediente');
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
      this.pizzaDos.ingredientes.push(ingrediente);
    });
  }
  eventoPublicar() {
    this.events.subscribe('seleccion-ingrediente', (ingrediente: IngredientesPromo) => {
      if (ingrediente.checked == true) {
        this.events.publish('seleccion-ingrediente', ingrediente);
      }
    });
  }



  siguiente(){
    this.eventoSeleccion();
    if (this.pizzaDos.ingredientes.length == 1) {
      this.presentAlert('Faltan ingredientes', 'Por favor selecciona un ingrediente más');
      return;
    } else if (this.pizzaDos.ingredientes.length == 0) {
        this.presentAlert('Faltan ingredientes', 'No has seleccionado ningún ingrediente');
        return;
      }
      else {
        this.eventoPublicar();
        this.pizzaDos.nombre="Pizza Dos";
        if (this.diaPromo==this.combos[1].NOMBRE || this.diaPromo==this.combos[2].NOMBRE || this.diaPromo==this.combos[4].NOMBRE){
          this.pizzaDos.costo = this.costoCombo/3;
        }
        if(this.diaPromo==this.combos[3].NOMBRE){
          this.pizzaDos.costo = this.costoCombo/4;
        }
        /*if (this.diaPromo=='Miercoles Tripleta' || this.diaPromo=='Jueves Sorpresa' || this.diaPromo=='Ultra Pack Dominguero'){
          this.pizzaDos.costo = this.costoCombo/3;
        }
        if(this.diaPromo=='Sabado Tetra'){
          this.pizzaDos.costo = this.costoCombo/4;
        }*/

        this.combo = this.navParams.get("combo");
        console.log(this.combo)
        this.combo['PIZZAS'].push(this.pizzaDos);
        console.log(this.combo)

       // let combo =  this.navParams.get("combo");

        this.navCtrl.push(PizzaTresPage, {
          pizzas : this.pizzas,
          promo : this.diaPromo,
          costo : this.costoCombo,
          tamanoPizza : this.tamanoPizza,
          combo : this.combo,
          combos : this.combos
        });
         this.terminarEventos();
      }   
  }

  editarPizzas() {
    if (this.objetivo == 'editar-pizza') {
      let combo =  this.navParams.get("combo");
      this.promocionales = this.navParams.get("promocionales"); //pizza que se quiere editar
      this.ingredientesEnabled = true;
      this.promocionales.forEach((pizzaDos) => {
        this.promocionales[1]["ingredientes"] = this.pizzaDos.ingredientes;
        console.log(this.promocionales[1]['ingredientes']);
        //this.pizzaUno.ingredientes = pizzaUno.ingredientes;
        if (pizzaDos.ingredientes.length < 2) {
          this.presentAlert('Faltan ingredientes', 'Por favor selecciona 2 ingrediente');
        }
        else {
          console.log(combo)
          this.navCtrl.push(CombinacionesPage, {
            promocionales : this.promocionales,
            promo : this.diaPromo,
            costo : this.costoCombo,
            opcional : this.objt,
            combo : combo
          });
        }
      });
    }
    this.terminarEventos();
  }

  removeItemFromArr(arr, item) {
    var i = arr.indexOf(item);
    if (i !== -1) {
      arr.splice(i, 1);
    }
  }

  @ViewChild("tabs") tabs: Tabs;
  @ViewChild(Slides) slides: Slides;
}
