import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, App, AlertController } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Borde } from "../../interfaces/IBorde";
import { Constantes } from '../../util/constantes';
import { HomePage } from '../home/home';

/**
 * Generated class for the BordesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bordes',
  templateUrl: 'bordes.html',
})
export class BordesPage {
  bordes: Array<Borde> ;

  bordeSeleccionado : Number;

  constructor(public navCtrl: NavController
              ,public navParams: NavParams
              ,public httpRequest : HttpRequestProvider
              ,public events: Events
              ,public loadingCtrl: LoadingController
              ,public app : App,
               public alertCtrl : AlertController ) {
    
              /* suscripcion de evento para edicion de pizzas creadas con anerioridad */
              this.events.subscribe("pizza", (pizza) => {
                if(pizza.borde != null){
                  let borde = pizza.borde;
                  this.bordeSeleccionado = borde.id;
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
    this.events.subscribe('cambio-tamano', (nuevoTamano) => {
      this.cargarBordes(nuevoTamano);
    });
    
    var tamano = this.navParams.get("tamano");
    if(tamano != null){
      this.cargarBordes(tamano);
    }
    
  }

  
  ngOnDestroy(){
    this.events.unsubscribe('cambio-tamano');
    this.events.unsubscribe("pizza");
   
  }


  ionViewWillEnter(){
    this.events.publish('tab-activo',"bordes");
    
    
  }

  radioChecked(value){
    this.bordeSeleccionado = value.id;
    this.events.publish('seleccion-borde', value);
  }


  /**
   * Este metodo carga todas los bordes a traves de un
   * servicio web en base a un tamanao especifico
   * @param tamano tamano de los bordes
   */
  cargarBordes(tamano : any){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    loading.present();
    this.bordes = new Array<Borde>();
    try{
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getTamanosBordesUrl(token,tamano.id)).then((data : any) => {
        
        var response = data.json();
        if(response["BORDES"] != undefined){
          response["BORDES"].forEach((child :any) => {
            let borde:Borde ={
              id: child.ID,
              nombre : child.NOMBRE,
              descripcion : child.DESCRIPCION,
              tamano : child.TAMANO,
              costo : child.COSTO
            }
            this.bordes.push(borde);
          });
         
          /* avisa que ya se ha terminado de cargar los bordes, para recibir cualquier pizza que se desee editar */
          this.events.publish('carga-completa',"bordes");
          loading.dismiss();
    
        }else{
          loading.dismiss();
          if(response["STATUS"] != 'OK'){
            console.log(response["DETALLE"])
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


}


