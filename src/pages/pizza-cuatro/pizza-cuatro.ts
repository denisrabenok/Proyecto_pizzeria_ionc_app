import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, App, LoadingController, AlertController, Platform, Events, ToastController, Slides } from 'ionic-angular';
import { PizzaPromo } from '../../interfaces/IPizzaPromo';
import { IngredientesPromo } from '../../interfaces/IIngredientesPromo';
import { IngredientesPromoPage } from '../ingredientes-promo/ingredientes-promo';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';
import { CombinacionesPage } from '../combinaciones/combinaciones';

@IonicPage()
@Component({
  selector: 'page-pizza-cuatro',
  templateUrl: 'pizza-cuatro.html',
})
export class PizzaCuatroPage {

  @ViewChild('tabs') tabRef: Tabs;
    pizzaCuatro  : PizzaPromo;
    public pizzas = [];
    public promocionales = [];

    ingredientesCuatro: Array<IngredientesPromo>;
    ingredientes: Array<IngredientesPromo>;
    ingredientesCont = [];
    tamanos : any;
    objetivo : String;
    objt : String
    tamanoElegido :any;
    /*   Tabs  */
    ingredientesTab= IngredientesPromoPage;
    ingredientesParams = {};
    ingredientesEnabled : boolean;
    diaPromo: string;
    costoCombo: number;
    tamanoPizza : any;
    combos = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public app: App, 
    public httpRequest : HttpRequestProvider, 
    public loadingCtrl: LoadingController, 
    public alertCtrl : AlertController,
    public platform: Platform, 
    public events : Events,
    public toastCtrl: ToastController) {  
      this.combos = this.navParams.get("combos");
    }

  ionViewDidLoad() { 
    //this.escucharEventos();
    this.pizzas = (this.navParams.get("pizzas"));
    this.pizzaCuatro = {ingredientes: [], nombre :null, descripcion : "Pizza combo promocional", imgUrl : null, tamano : null, costo:null, cantidad:1};
    this.diaPromo = this.navParams.get("promo");
    this.costoCombo = this.navParams.get('costo');
    //this.combos = this.navParams.get("combos");
    this.cargarTamanos();
    this.ingredientesEnabled = true;
    this.tamanoPizza = this.navParams.get("tamanoPizza");
    
    this.objetivo = this.navParams.get("objetivo");
    if (this.objetivo!='editar-pizza'){
      this.pizzas.push(this.pizzaCuatro);
      console.log(this.pizzas)
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
 
  /*async cargarTamanos(){
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
            this.tamanoElegido = this.tamanos[0];
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
  }*/

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
            //this.pizzaUno.tamano = this.tamanoElegido;
            this.tamanoElegido = this.tamanos[0];
            this.pizzaCuatro.tamano = this.tamanos[0];
            this.cargarIngredientes();
          }
          if (this.tamanoPizza.nombre == this.tamanos[1].nombre ) {
            this.tamanoElegido = this.tamanos[1];
            this.pizzaCuatro.tamano = this.tamanos[1];
            this.cargarIngredientes();
          }
          if (this.tamanoPizza.nombre == this.tamanos[2].nombre ) {
            this.tamanoElegido = this.tamanos[2];
            this.pizzaCuatro.tamano = this.tamanos[2];
            this.cargarIngredientes();
          }
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
    console.log(this.tamanos);
    //let tamanos = this.navParams.get("tamano");
    let tamanos = this.tamanoElegido;

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

  handlerCheckbox(ingrediente: IngredientesPromo) {
    if (ingrediente.checked == true) {
      this.ingredientesCont.push(ingrediente);
      this.bloquearAdiccionIngredientes(this.ingredientes);
      console.log(this.ingredientesCont);
    } else if (ingrediente.checked == false) {
      this.removeItemFromArr(this.ingredientesCont, ingrediente);
      this.bloquearAdiccionIngredientes(this.ingredientes);
    }
    console.log(this.ingredientes);
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
      this.pizzaCuatro.ingredientes.push(ingrediente);
    });
  }
  eventoPublicar() {
    this.events.subscribe('seleccion-ingrediente', (ingrediente: IngredientesPromo) => {
      if (ingrediente.checked == true) {
        this.events.publish('seleccion-ingrediente', ingrediente);
      }
    });
  }

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
  this.events.subscribe('seleccion-ingrediente', (ingredienteTres : IngredientesPromo) => {
   var ingredienteIndex 
     if(ingredienteTres.checked){
       if(this.pizzaCuatro.ingredientes.length > 1){
         this.ingredientesEnabled = false;
         ingredienteTres.checked = false;
          this.presentAlert("Ingredientes excedidos", "Solo puede elegir dos ingredientes");
          this.pizzaCuatro.ingredientes.length = 1
        } else {
       if (this.pizzaCuatro.ingredientes.filter(function(e ,index) { return e.id === ingredienteTres.id ; }).length > 0) { //si ya contiene el elemento
         ingredienteIndex = this.pizzaCuatro.ingredientes.map(function (x) { return x.id; }).indexOf(ingredienteTres.id);
         this.pizzaCuatro.ingredientes[ingredienteIndex] = ingredienteTres;                                              //se reemplaza
       }else{     
         this.pizzaCuatro.ingredientes.push(ingredienteTres);                                                             //se agrega
       }
     }    
   }else{                                                                                                        //se quita de la lista
       ingredienteIndex = this.pizzaCuatro.ingredientes.map(function (x) { return x.id; }).indexOf(ingredienteTres.id);
       this.pizzaCuatro.ingredientes.splice(ingredienteIndex,1 );        
     }
 }); 
}


  /*
  Eliminar todas las suscripciones
  */
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
    this.pizzaCuatro.ingredientes = [];
    this.ingredientesEnabled = false;
    this.tabRef.select(0, { animate: true });
    this.pizzaCuatro.tamano = tamano;
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

  siguiente(){
    this.eventoSeleccion();
    if (this.pizzaCuatro.ingredientes.length == 1) {
      this.presentAlert('Faltan ingredientes', 'Por favor selecciona un ingrediente más');
      return;
    } else if (this.pizzaCuatro.ingredientes.length == 0) {
        this.presentAlert('Faltan ingredientes', 'No has seleccionado ningún ingrediente');
        return;
      }
    else{
      this.eventoPublicar();
      this.pizzaCuatro.nombre="Pizza Cuatro";
      //Sabado
      if(this.diaPromo == this.combos[3].NOMBRE){
        this.pizzaCuatro.costo = this.costoCombo/4;
      }
      //Miercoles, Jueves
      else if(this.diaPromo == this.combos[1].NOMBRE || this.diaPromo == this.combos[2].NOMBRE){
        this.pizzaCuatro.costo = this.costoCombo/3;
      }
      let combo =  this.navParams.get("combo");
      this.navCtrl.push(CombinacionesPage, {
        promocionales : this.pizzas,
        promo : this.diaPromo,
        costo : this.costoCombo,
        opcional : this.objt,
        combo : combo
      });  
    }
    this.terminarEventos(); 
  }

  editarPizzas() {
    if (this.objetivo == 'editar-pizza') {
      let combo =  this.navParams.get("combo");
      this.promocionales = this.navParams.get("promocionales"); //pizza que se quiere editar
      this.ingredientesEnabled = true;
      this.promocionales.forEach((pizzaCuatro) => {
        this.promocionales[3]["ingredientes"] = this.pizzaCuatro.ingredientes;
        console.log(this.promocionales[3]['ingredientes']);
        //this.pizzaUno.ingredientes = pizzaUno.ingredientes;
        if (pizzaCuatro.ingredientes.length < 2) {
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
