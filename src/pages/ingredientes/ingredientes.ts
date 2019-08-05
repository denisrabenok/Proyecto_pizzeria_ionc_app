import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, App, AlertController} from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Ingrediente } from "../../interfaces/IIngrediente";
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-ingredientes',
  templateUrl: 'ingredientes.html',
})
export class IngredientesPage {

  ingredientes: Array<Ingrediente> ;
  porciones = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public httpRequest : HttpRequestProvider, 
              public events: Events, 
              public loadingCtrl: LoadingController,
              public app : App,
              public alertCtrl : AlertController 
             ) {
  /* suscripcion de evento para edicion de pizzas creadas con anerioridad */
            this.events.subscribe("pizza", (pizza) => {
                if(pizza.ingredientes.length >0){
                  let ingredientes = pizza.ingredientes;
                  ingredientes.forEach(ingrediente => {
                    let index = this.ingredientes.map(function (x) { return x.id; }).indexOf(ingrediente.id);
                    console.log(ingrediente)
                    this.ingredientes[index] =  ingrediente;
                  });
                }        
            });    
  }

  /** Este metodo sera llamado cada que se ingrese al tab */
  ionViewDidLoad() {
    this.cargarPorciones();

    /* Se suscribe al evento publicado por crear-pizza para actualizar los valores cuando el tamano escogido cambie */
    this.events.subscribe('cambio-tamano', (tamano:any) => {
      this.cargarIngredientes(tamano);
    });
  }

  ionViewWillEnter(){
    this.events.publish('tab-activo',"ingredientes");
  }

  ngOnDestroy(){
    this.events.unsubscribe('cambio-tamano');
    this.events.unsubscribe("pizza");
  }

  /**
   * Este metodo carga todas los ingredientes a traves de un servicio web en base a un tamanao especifico
   * @param tamano tamano de los ingredientes */
  cargarIngredientes(tamano : any){
    this.ingredientes = new Array<Ingrediente>();
    try{
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getTamanosIngredientesUrl(token, tamano.id)).then((data : any) => {
        var response = data.json();
        if(response["INGREDIENTES"] != undefined){
          response["INGREDIENTES"].forEach((child : any) => {
            let porcionesJson = JSON.parse(JSON.stringify(this.porciones));   //se crea una para no alterar el arreglo original
            /*Se agrega el campo id a cada porcion, para poder identificar a que ingrediente 
            modificar el costo cuando se elija una porcion*/
            let porciones= [];
          // this.porciones.forEach(function (value) {
          //   let porcion :Porcion ={
          //     id : String(value.id),
          //     nombre : String(value.nombre),
          //     valor : Number(value.valor),
          //   };
          //   porciones.push(porcion);
          // });
            let ingrediente:Ingrediente ={
              id: child.ID,
              nombre : child.NOMBRE,
              descripcion : child.DESCRIPCION,
              imagenUrl :  child.IMAGEN_URL,
              tamano : child.TAMANO,
              costoBase : Number(child.COSTO),
           //.   porciones : porciones,
              porcion : this.porciones[0],
              checked : false
            }
            this.ingredientes.push(ingrediente);
          });
           /* avisa que ya se ha terminado de cargar los bordes, para recibir cualquier pizza que se desee editar */
          this.events.publish('carga-completa',"ingredientes");                    
        }else{         
          if(response["STATUS"] != 'OK'){
            this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
          }
        }      
      });
    }
    catch(err) {
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }
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
            this.app.getRootNavs()[0].setRoot(HomePage)
          }
        }   
      ]
    });
    alert.present();
   }

  async cargarPorciones(){
    try {
      let token = window.localStorage.getItem("userToken");
      await this.httpRequest.get(Constantes.getPorcionesUrl(token)).then((data : any) => {
        var response = data.json();
        if(response["PORCIONES"] != undefined){
          response["PORCIONES"].forEach(porcion => {
            this.porciones.push({"id": porcion.ID , "nombre":porcion.NOMBRE , "valor":porcion.VALOR});
          });
          var tamano = this.navParams.get("tamano");
          this.cargarIngredientes(tamano);
        }else{
          if(response["STATUS"] != 'OK'){
            console.log(response["DETALLE"])
            this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
          }
        }     
       });
    }
    catch(err) {
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }
  }

  /**
   * Este metodo se ejecutara cuando se seleccione una opcion del select
   * @param porcion contendra el objeto elegido del select */
  cambioPorcion(ingrediente: Ingrediente) {
    //let ingredienteExt : Ingrediente;
    //this.ingredientes.forEach(function (ingrediente : Ingrediente) {
    //    let id = porcion.ingrediente;
    //    if( id == ingrediente.id){
    //      ingrediente.costo = Number(ingrediente.costoBase) *porcion.valor;
    //      ingredienteExt = ingrediente;
    //    }
    //});
    if (ingrediente.checked) {
      this.events.publish('seleccion-ingrediente', ingrediente);
    }
  }

  //Número máximo de casillas marcadas por cada fila 

  
  /** Este metodo procesara la accion de seleccionar un ingrediente
   * @param ingrediente  ingrediente que captura el evento del checkbox */
  handlerCheckbox(ingrediente : Ingrediente){
    this.events.publish('seleccion-ingrediente', ingrediente );
  }  
}