import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { HttpClientModule } from '@angular/common/http';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { Facebook } from '@ionic-native/facebook';
import { HttpModule } from '@angular/http';
import {IonicStorageModule} from '@ionic/storage';
import { GoogleMaps } from '@ionic-native/google-maps';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegistroPage } from '../pages/registro/registro';
import { LoginPage } from '../pages/login/login';
import { InicioPage } from '../pages/inicio/inicio';
import { PerfilPage } from '../pages/perfil/perfil';
import { PerfilEditarPage } from '../pages/perfil-editar/perfil-editar';
import { RegistroFormPage} from '../pages/registro-form/registro-form';
import { TradicionalesPage } from '../pages/tradicionales/tradicionales';
import { FavoritasPage } from '../pages/favoritas/favoritas';
import { RegistroSocialPage } from '../pages/registro-social/registro-social';
import { CrearPizzaPage } from '../pages/crear-pizza/crear-pizza';
import { MasasPage } from '../pages/masas/masas';
import { BordesPage } from '../pages/bordes/bordes';
import { IngredientesPage } from '../pages/ingredientes/ingredientes';
import { HttpRequestProvider } from '../providers/http-request/http-request';
import { AdicionalesPage } from '../pages/adicionales/adicionales';
import { BebidasPage } from '../pages/bebidas/bebidas';
import { AcompanantesPage } from '../pages/acompanantes/acompanantes';
import { CombinacionesPage } from '../pages/combinaciones/combinaciones';
import { TrackingPizzaPage } from '../pages/tracking-pizza/tracking-pizza';
import { CarritoPage } from '../pages/carrito/carrito';
import { ComboPage } from '../pages/combo/combo';
import { DetalleComboPage } from '../pages/detalle-combo/detalle-combo';
import { SetUbicationPage } from '../pages/set-ubication/set-ubication';
import { ListUbicationPage } from '../pages/list-ubication/list-ubication';
import { ListLocalesPage } from '../pages/list-locales/list-locales';
import { ViewMapPage } from '../pages/view-map/view-map';
import { Camera } from '@ionic-native/camera';
import { ReclamosSugerenciasPage } from '../pages/reclamos-sugerencias/reclamos-sugerencias';
import { ListaPedidosPage } from '../pages/lista-pedidos/lista-pedidos';
import { FcmProvider } from '../providers/fcm/fcm';
import { Firebase } from '@ionic-native/firebase';
import {PizzaUnoPage} from '../pages/pizza-uno/pizza-uno';
import {PizzaDosPage} from '../pages/pizza-dos/pizza-dos';
import {PizzaTresPage} from '../pages/pizza-tres/pizza-tres';
import {PizzaCuatroPage} from '../pages/pizza-cuatro/pizza-cuatro';
import {IngredientesPromoPage} from '../pages/ingredientes-promo/ingredientes-promo';
import {DetallePromocionalPage} from '../pages/detalle-promocional/detalle-promocional';
import {SeleccionMetodoPagoPage} from '../pages/seleccion-metodo-pago/seleccion-metodo-pago';
import {CarteraTarjetasPage} from '../pages/cartera-tarjetas/cartera-tarjetas';
import { ResumenDePagoPage } from '../pages/resumen-de-pago/resumen-de-pago';
import { CheckoutPage } from '../pages/checkout/checkout';
import { CarritoPPage } from '../pages/carritoP/carritoP';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { ValoresPage } from '../pages/valores/valores'
import { HistorialPage } from '../pages/historial/historial';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {  AlertController } from 'ionic-angular';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { IrregularidadesPage } from '../pages/irregularidades/irregularidades';
import {enableProdMode} from '@angular/core';
import { PedidoEstadoPage } from '../pages/pedido-estado/pedido-estado';
import { PedidoPage } from '../pages/pedido/pedido';
import { PedidoDetallesPage } from '../pages/pedido-detalles/pedido-detalles';
import { FormaEntregaPage } from '../pages/forma-entrega/forma-entrega';
import { SalaChatPage } from '../pages/sala-chat/sala-chat';
import { FormaPagoPage } from '../pages/forma-pago/forma-pago';
import { PromoMarViePage } from '../pages/promo-mar-vie/promo-mar-vie';

enableProdMode();


const firebaseConfig={
  apiKey: "AIzaSyBxeO1AS36TObv6j9GY7t5Iqn30qaLTf9M",
  authDomain: "pizzeriaapp-f505e.firebaseapp.com",
  databaseURL: "https://pizzeriaapp-f505e.firebaseio.com",
  projectId: "pizzeriaapp-f505e",
  storageBucket: "pizzeriaapp-f505e.appspot.com",
  messagingSenderId: "320424180530"
}


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CrearPizzaPage,
    InicioPage,
    RegistroPage,
    PerfilEditarPage,
    PerfilPage,
    LoginPage,
    RegistroFormPage,
    TradicionalesPage,
    FavoritasPage,
    RegistroSocialPage,
    MasasPage,
    BordesPage,
    IngredientesPage,
    AdicionalesPage,
    BebidasPage,
    AcompanantesPage,
    CombinacionesPage,
    TrackingPizzaPage,
    CarritoPage,
    ComboPage,
    DetalleComboPage,
    SetUbicationPage,
    ListUbicationPage,
    ViewMapPage,
    ReclamosSugerenciasPage,
    ListaPedidosPage,
    PedidoEstadoPage,
    PedidoPage,
    PedidoDetallesPage,
    FormaEntregaPage,
    SalaChatPage,
    FormaPagoPage,
    ListLocalesPage,


    SeleccionMetodoPagoPage,
    CarritoPPage,
    CheckoutPage,
    CarteraTarjetasPage,
    ValoresPage,
    HistorialPage,
    ResumenDePagoPage,
    IrregularidadesPage,
    PizzaUnoPage,
    PizzaDosPage,
    PizzaTresPage,
    PizzaCuatroPage,
    IngredientesPromoPage,
    DetallePromocionalPage,
    PromoMarViePage,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    BrMaskerModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    ,tabsPlacement: 'top'}),
    AngularFireModule.initializeApp(firebaseConfig),
    IonicStorageModule.forRoot({
      name: '__app_pizzeria',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AngularFireAuthModule,
    HttpModule,
    //CloudModule.forRoot(cloudSettings),



  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegistroPage,
    InicioPage,
    LoginPage,
    PerfilPage,
    PerfilEditarPage,
    RegistroFormPage,
    TradicionalesPage,
    FavoritasPage,
    RegistroSocialPage,
    CrearPizzaPage,
    MasasPage,
    BordesPage,
    IngredientesPage,
    AdicionalesPage,
    BebidasPage,
    AcompanantesPage,
    CombinacionesPage,
    TrackingPizzaPage,
    CarritoPage,
    ComboPage,
    DetalleComboPage,
    SetUbicationPage,
    ListUbicationPage,
    ViewMapPage,
    ReclamosSugerenciasPage,
    ListaPedidosPage,
    PedidoEstadoPage,
    PedidoPage,
    PedidoDetallesPage,
    FormaEntregaPage,
    SalaChatPage,
    FormaPagoPage,
    ListLocalesPage,
    SeleccionMetodoPagoPage,
    CarritoPPage,
    CheckoutPage,
    CarteraTarjetasPage,
    ValoresPage,
    HistorialPage,
    ResumenDePagoPage,
    IrregularidadesPage,
    PizzaUnoPage,
    PizzaDosPage,
    PizzaTresPage,
    PizzaCuatroPage,
    IngredientesPromoPage,
    DetallePromocionalPage,
    PromoMarViePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    Camera,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    Facebook,
    HttpRequestProvider,
    Firebase,
    FcmProvider,
    AngularFireAuth,

    HttpModule,
    HttpClientModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiServiceProvider,
    InAppBrowser,
    AlertController,
  ]
})
export class AppModule {}
