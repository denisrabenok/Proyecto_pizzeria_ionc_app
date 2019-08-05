import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Events, LoadingController,  Platform  } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { HistorialPage } from '../../pages/historial/historial';
import { CarritoPage } from '../../pages/carrito/carrito'
import { stringify } from '@angular/compiler/src/util';
import { detachEmbeddedView } from '@angular/core/src/view';
import { Constantes } from '../../util/constantes';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { HomePage } from '../home/home';



/**
 * Generated class for the ResumenDePagoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-resumen-de-pago',
  templateUrl: 'resumen-de-pago.html',
})

export class ResumenDePagoPage {

  selectedItems: Array<any>;
  total_value : number;
  pending_value : number = this.total_value;
  cards: Array< {holder_name: String, expiry_year: String, expiry_month: String, icon: String, number: String, card_token: String, value: number, installments:number}> = [];
  enablePayment: boolean = false;
  enableWarning:boolean = false; 
  order:any = {}

  destallesCompra: string;
  productos: any;
  venta: any;

 

  public pizzas =  []
  public adicionales = []
  public combos = []

  public cargando = false;

  public costoTotal : Number;
  



  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiServiceProvider, 
    public httpRequest : HttpRequestProvider
            , public events: Events
            , public loadingCtrl: LoadingController
            , public alertCtrl : AlertController) {
    
    // Obtiene tarjetas seleccionadas para el pago desde la vista padre
    this.selectedItems = navParams.get('cards');
    this.total_value = navParams.get('total_value');
    if (this.selectedItems)
      this.cards=this.selectedItems;
      //console.log(this.cards)

    this.destallesCompra = "";
  }

  /**
   * Invoca al componente resumen de pago para realizar el pago
   */
  historial() {
    this.navCtrl.setRoot(HistorialPage, { cards:this.cards
    });
  }

  async registrarVenta(venta){
    await this.api.postVentas(venta);
  }


  pagar(){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
       
    let alert = this.alertCtrl.create({
      title: "Esta seguro de que desea continuar?",
      
      message: "El valor total de esta compra es $"+  this.total_value.toString(),
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            let token = window.localStorage.getItem("userToken");
            this.httpRequest.get(Constantes.getCarritoUrl(token)).then((data : any) => {
              
              var response = data.json();
              //console.log(JSON.stringify(response));

              this.order['description']= JSON.stringify(response);
              this.order['dev_reference'] = 'null';
              this.order['vat'] = 0;
              this.order['tax_percentage'] = 0;
              
              this.api.pay(this.cards, this.order).then((result) => { 

              // Aqui hay que hacer la extracción de datos de la respuesta de paymentez

              var json = JSON.parse(result['_body']);
              
              if (!json['error']){
             
              
                //console.log(json);
                //console.log(this.cards[0].card_token)
                var d = this.cards[0].card_token;

                for(var i in json){
                  //console.log(json[i]['card']['bin']);

                  if (json[i]['transaction']['status'] == "success"){
                    this.venta = {
                      "tarjetaV": json[i]['card']['bin'] + " XXXX XXXX " + json[i]['card']['number'],
                      "descripcion": JSON.stringify(response),
                      "valor": json[i]['transaction']['amount'],
                    }
                    this.enviarPedido();
                    this.registrarVenta(this.venta);
                    
                  }
                  
                }
                this.historial();
              } else{
                this.showFailure()
              }
            }, (err)=>{
              this.cargando = false;
              loading.dismiss();
              this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
            });
            
            
          });
        }},
        {
          text: 'Cancelar',
          role: 'cancel'
      }]
    });
    alert.present();
    //this.api.pay(this.cards).then((result) => { console.log(result['_body']) })   
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
    //console.log(this.cards);
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
            this.navCtrl.setRoot(HomePage)
          }
        }
     
        
      ]
    });
    alert.present();
    
   }

  showFailure(){
    let alert = this.alertCtrl.create({
      title: "La transaccion no pudo ser completada. Verifique sus metodos de pago",
      
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            this.showCarrito();
          }
        }]
    });
    alert.present();
  }

  showCarrito(){
    this.navCtrl.setRoot(CarritoPage, { cards:this.cards
    });
  }


  enviarPedido(){
    let loading = this.loadingCtrl .create({
      content: 'Cargando...'
    });
    let pedido = this.navParams.get('pedido');
    
    console.log("pedido en el pago ", pedido);

    this.httpRequest.post(Constantes.CREAR_PEDIDOS, pedido).then((data : any)=>{
      var response = data.json();
      console.log(response)
      if(response["STATUS"] == 'OK'){
        this.mostrarMensaje("Pedido enviado","Tu pedido ha sido recibido exitosamente, ahora puedes revisar el estado de tu pedido");
        loading.dismiss();
      }else{
        loading.dismiss();
        this.mostrarMensaje("","Estamos teniendo inconvenientes, por favor intenta nuevamente");
      }
    }, (err)=>{
      loading.dismiss();
      this.mostrarMensaje("","Estamos teniendo inconvenientes, por favor intenta nuevamente");
    });

  }

  

}
