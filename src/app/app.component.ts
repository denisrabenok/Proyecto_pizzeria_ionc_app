import { Component, ViewChild } from '@angular/core';
import { Nav, App, Platform, MenuController, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PerfilPage} from '../pages/perfil/perfil';
import { LoginPage } from '../pages/login/login';
import { TradicionalesPage } from '../pages/tradicionales/tradicionales';
import { FavoritasPage } from '../pages/favoritas/favoritas';
import { CrearPizzaPage } from '../pages/crear-pizza/crear-pizza';
import { HomePage } from '../pages/home/home';
import { ComboPage } from '../pages/combo/combo';
import { ListUbicationPage } from '../pages/list-ubication/list-ubication';
import { ReclamosSugerenciasPage } from '../pages/reclamos-sugerencias/reclamos-sugerencias';
import { ListaPedidosPage } from '../pages/lista-pedidos/lista-pedidos';
import { FcmProvider } from '../providers/fcm/fcm';
import { tap } from 'rxjs/operators';
import {CarteraTarjetasPage} from '../pages/cartera-tarjetas/cartera-tarjetas';
import { HistorialPage } from '../pages/historial/historial'
import { Storage } from '@ionic/storage';
import { IrregularidadesPage } from '../pages/irregularidades/irregularidades';
import { HttpRequestProvider } from '../providers/http-request/http-request';
import { Constantes } from '../util/constantes';


export interface MenuItem {
  title: string;
  component: any;
  icon: string;
  color: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any ;
  //rootPage:any = LoginPage;
  public alertShown:boolean = false;
  pages: Array<{title: string, component: any}>;
  appMenuItems: Array<MenuItem>;
  nombre : any;
  imagen : any;

  constructor( 
    public platform: Platform, 
    public  menu: MenuController, 
    public  statusBar: StatusBar, 
    public fcm : FcmProvider,
    public  toastCtrl : ToastController, 
    public splashScreen: SplashScreen,  
    public alertCtrl : AlertController,
    public App : App,
    public storage: Storage,
    public httpRequest: HttpRequestProvider) {

      if( window.localStorage.getItem("userToken") != null){
        this.storage.set('userToken', window.localStorage.getItem("userToken"));
        this.storage.set('email',window.localStorage.getItem("email"));
        console.log( window.localStorage.getItem("userToken"))
        this.datosUsuario();
        
          this.rootPage = HomePage;
      }else{
          this.rootPage = LoginPage;
      }

      

    /* platform.ready().then(() => {
        statusBar.styleDefault();
        splashScreen.hide();
        platform.registerBackButtonAction(() => {
           let view = this.nav.getActive();
           if (view.component.name == 'HomePage') {
              if (this.alertShown == false) {
            this.presentConfirm();
          } else {
            this.nav.pop();
          }
           }
        }, 0)
      });*/
      this.platform.ready().then(() => {

        //Back button handling
        var lastTimeBackPress = 0;
        var timePeriodToExit = 2000;
        this.platform.registerBackButtonAction(() => {
          // get current active page
          let view = this.nav.getActive();
          if (view.instance instanceof HomePage) {
            if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                this.platform.exitApp(); //Exit from app
            } else {
              let toast = this.toastCtrl.create({
                message: 'Tap Back again to close the application.',
                duration: 2000,
                position: 'bottom',
              });
              toast.present();     
              lastTimeBackPress = new Date().getTime();
            } 
          } else {
            this.nav.pop({}); // go to previous page
          }
        });
      }); 

      this.initializeApp();

      this.appMenuItems = [
        {title: 'Inicio', component: HomePage, icon: 'assets/imgs/inicio.png', color: '#BE1D3E'},
        {title: 'Perfil', component: PerfilPage, icon: 'assets/imgs/perfil.png', color:'#BE1D3E'},
   //     {title: 'Carrito de Compras', component: CarritoPage, icon: 'cart'},
        {title: 'Ordenar Pizza', component: CrearPizzaPage, icon: 'assets/imgs/orden_pizza.png', color:'secondary_red'},
        {title: 'Pizzas Gourmet', component: TradicionalesPage, icon: 'assets/imgs/pizza_trad.png', color:'green'},
        {title: 'Combos Pizza', component: ComboPage, icon: 'assets/imgs/combo.png', color:'mostaza'},
        {title: 'Pizza Favorita', component: FavoritasPage, icon: 'assets/imgs/pizza_fav.png', color:'secondary_red'},
        {title: 'Status de Pedido', component: ListaPedidosPage, icon: 'assets/imgs/rastreo.png', color:'green'},
        {title: 'Mis Direcciones', component: ListUbicationPage, icon: 'assets/imgs/direcciones.png', color:'mostaza' },
        {title: 'Reclamos y Segurencias', component: ReclamosSugerenciasPage, icon: 'assets/imgs/menu_sugerencias.png', color:'green'},
        { title: 'Cartera de Tarjetas', component: CarteraTarjetasPage, icon: 'assets/imgs/menu_creditcard.png', color:'green'},
        { title: 'Historial de Pagos', component: HistorialPage, icon: 'assets/imgs/menu_historial.png', color:'green'},
        { title: 'Irregularidades', component: IrregularidadesPage, icon: 'assets/imgs/menu_eventualidades.png', color:'green'},
      ];
     // window.localStorage.setItem("userToken", "alskmalskdmalskdmasldkmlkm12l3m12lk3m1l3k1mldkmsla");    //Borrar
      window.localStorage.setItem("resumenActivo", "false");
  }

 

  appClosePromt() {
    let alert = this.alertCtrl.create({
      title: '',
      message: 'Do you want to exit?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            // Dismiss
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present();  
  }
  
  openPage(page) {
    //Reset the content nav to have just this page
    //we wouldn't want the back button to show in this scenario
    if(page.component) {
      let resumenActivo = window.localStorage.getItem("resumenActivo");
      if(resumenActivo == "true"){
        this.alerta(page)
      }else{
        this.nav.setRoot(page.component);
        this.menu.close();
      }
    } else {
        // logica cerrar sesion
        window.localStorage.clear();
        this.logout();
        this.menu.close();
    }
  }

  logout() {
    window.localStorage.clear();
    this.nav.setRoot(LoginPage);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      //*** Control Splash Screen
      // this.splashScreen.show();
      // this.splashScreen.hide();

       // Get a FCM token
       this.fcm.getToken()

       this.fcm.listenToNotifications().pipe(
         tap(msg => {
           console.log(msg)
           const toast = this.toastCtrl.create({
             message: msg.body,
             duration: 3000
           });
           toast.present();
         })
       )
       .subscribe()

      //*** Control Status Bar
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);

      //*** Control Keyboard
     // this.keyboard.disableScroll(true);
    });
  }

  alerta(page) {
    let alert = this.alertCtrl.create({
      title: 'Salir de resumen',
      message: 'Si no añades estos elementos al carrito se perderán, ¿estás seguro que deseas salir? ',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Si',
          handler: () => {
            this.nav.setRoot(page.component);
            this.menu.close();
          }
        }
      ]
    });
    alert.present();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirmación de salida ',
      message: 'Quiere salir de la aplicación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.alertShown = false;
          }
        },
        {
          text: 'Si',
          handler: () => {
            console.log('Yes clicked');
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present().then(() => {
      this.alertShown = true;
    });
  }

  datosUsuario(){
    try {
      let token = window.localStorage.getItem("userToken");
      this.httpRequest.get(Constantes.getVerPefilUrl(token)).then((data: any) => {
        var response = data.json();
        console.log(response);
        if(response["NOMBRES"]==null && response["APELLIDOS"]==null ){
          this.nombre = 'Usuario';
        } else {
          this.nombre = response["NOMBRES"]+" "+ response["APELLIDOS"];
          console.log(this.nombre);
        }

        if(response["IMAGEN"]==null){
           this.imagen = null;
        } else {
          this.imagen = response["IMAGEN"];
        }
      });
    }
    catch (err) {
      //this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }
  }
}
