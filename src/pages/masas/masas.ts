import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, AlertController, App } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Masa } from "../../interfaces/IMasa";
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';


/**
 * Generated class for the MasasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-masas',
  templateUrl: 'masas.html',
})
export class MasasPage {

  masas: Array<Masa> ;

  masaSeleccionada : Number;
  
  constructor(public app : App, 
              public navCtrl: NavController, public navParams: NavParams
              ,public httpRequest : HttpRequestProvider
              ,public events: Events
              ,public loadingCtrl: LoadingController
              , public alertCtrl : AlertController ) {
                
             /* suscripcion de evento para edicion de pizzas creadas con anerioridad */
              this.events.subscribe("pizza", (pizza) => {
                if(pizza.masa != null){
                  let masa = pizza.masa;
                  this.masaSeleccionada = masa.id;
                }
                
              
              });
      
  }

  /**
   * Este metodo sera llamado cada que se ingrese al tab
   */
  ionViewDidLoad() {
    /*
      Se suscribe al evento publicado por crear-pizza
      para actualizar los valores cuando el tamano
      escogido cambie
   */
    this.events.subscribe('cambio-tamano', (nuevoTamano ) => {
      this.cargarMasas(nuevoTamano);
    });
    
    var tamano = this.navParams.get("tamano");
    if(tamano != null){
      this.cargarMasas(tamano)
    }
   
  }

  ionViewWillEnter(){
    this.events.publish('tab-activo',"masas");
    
    
  }

  radioChecked(value){
    this.masaSeleccionada = value.id;
    this.events.publish('seleccion-masa', value);
  }

  /**
   * Este metodo carga todas las masas a traves de un
   * servicio web en base a un tamanao especifico
   * @param tamano tamano de las masas
   */
  cargarMasas(tamano : any){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present()
    this.masas = new Array<Masa>();
    try {
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getTamanosMasasUrl(token,tamano.id)).then((data : any) => {
        var response = data.json();
        if(response["MASAS"] != undefined){
          response["MASAS"].forEach((child :any) => {
            let masa:Masa ={
              id: child.ID,
              nombre : child.NOMBRE,
              descripcion : child.DESCRIPCION,
              tamano : child.TAMANO,
              costo : child.COSTO
            }
            this.masas.push(masa);
          });
    
          /* avisa que ya se ha terminado de cargar las masas, para recibir cualquier pizza que se desee editar */
          this.events.publish('carga-completa',"masas");
        
          loading.dismiss();
        }else{
          loading.dismiss();
          if(response["STATUS"] != 'OK'){
            this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
          }
        }
        
      }, (err)=>{
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
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

  ngOnDestroy(){
    this.events.unsubscribe("cambio-tamano");
    this.events.unsubscribe("pizza");
  }
  
 
   

}
