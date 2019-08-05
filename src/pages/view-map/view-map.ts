import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, App } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request'
import {GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker, Poly } from '@ionic-native/google-maps';
import { SetUbicationPage } from '../set-ubication/set-ubication';
import { Constantes } from '../../util/constantes';
import { Http, HttpModule } from '@angular/http';
import { ListUbicationPage } from '../list-ubication/list-ubication';
import { ToastController } from 'ionic-angular';
import { FormaPagoPage } from '../forma-pago/forma-pago';

@IonicPage()
@Component({
  selector: 'page-view-map',
  templateUrl: 'view-map.html',
})
export class ViewMapPage {

  map: GoogleMap;
  type_page: any;

  ubication: any;
  latLng: any;
  marker: null;

  locales = [];
  poligonos = [];

  ubications_list = [];

  poligonoId  : any;
  coordenada : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private googleMaps: GoogleMaps
    , public Http: Http
    , public app: App
    , public httpRequest: HttpRequestProvider
    , public loadingCtrl: LoadingController
    , public alertCtrl: AlertController
    , public toastCtrl: ToastController) {
    this.type_page = navParams.get('type');
    console.log(navParams.get('type'));
    this.ubication = navParams.get('data');
    console.log(navParams.get('data'));
    this.latLng = {
      lat: +this.ubication['LATITUD'],
      lng: +this.ubication['LONGITUD']
    }
    if (this.type_page === 'cobertura') {
      console.log('GETTING LIST');
      this.getUbications();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewMapPage');
    this.loadMap();
  }

  getLocales() {
    if (this.locales.length == 0) {
      let loading = this.loadingCtrl.create({
        content: 'Cargando...'
      });
      loading.present()
      var token = window.localStorage.getItem("userToken");
      try {
        console.log(Constantes.getTodosLocales(token))
        this.httpRequest.get(Constantes.getTodosLocales(token)).then((res: any) => {
          res = res.json();
          // let data = res.DIRECCIONES
          //  OTRA SOLUCION MAS MEJOR :v
          if (res.STATUS != 'OK') {
            console.log(res);
            loading.dismiss();
            this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
          } else {
            this.locales = res["LOCALES"];
            console.log(this.locales);
            loading.dismiss();
          }
        });
      } catch (err) {
        this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
      }
    }
  }

  loadMap() {
    let mapOptions: GoogleMapOptions = {
      controls: {
        compass: true,
        myLocationButton: true,
        indoorPiker: true,
        zoom: true
      },
      gestures: {
        scroll: true,
        tilt: true,
        rotate: true,
        zoom: true
      },
      camera: {
        target: {
          lat: -2.134636, // default location
          lng: -79.926739 // default location
        },
        zoom: 18,
        tilt: 30
      }
    };
    this.getLocales();
    // this.map = this.googleMaps.create('map_canvas', mapOptions);
    this.map = GoogleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        // Now you can use all methods safely.
        this.addLocalesMarkers();
        this.getPosition();
      })
      .catch(error => {
        console.log(error);
      });

    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((e) => {
      // Colocando marcador para guardar direccion
      if (this.type_page === 'set') {
        console.log(e[0]);
        this.map.clear();
        this.addLocalesMarkers();
        this.map.addMarker({
          icon: 'red',
          position: e[0]  // {lat: some_data, lng: some_data}
        })
        this.marker = e[0];
        this.map.animateCamera({
          target: e[0], // {lat: some_data, lng: some_data}
          zoom: 17,
          duration: 5000
        });
      }
      // Checking si marcador esta dentro de poligono o no
      if (this.type_page === 'cobertura') {
        let position = e[0];
        this.map.clear();
        this.addLocalesMarkers();
        this.poligonoId =  this.isInPoligono(position) ;

        // if( this.poligonoId !== null ){
        //   this.coordenada = e[0];
        //   //Dibujar marcador
        //     this.map.clear();
        //     this.map.addMarker({
        //       icon: 'red',
        //       position: e[0]
        //     })
        //     this.marker = e[0];
        //     this.map.animateCamera({
        //       target: e[0],
        //       zoom: 17,
        //       duration: 5000
        //     });
        // }


      }
    })

  }

  getPosition() {
    this.map.getMyLocation()
      .then(response => {
        this.map.moveCamera({
          target: this.latLng
          //target: response.latLng
        });
        if (this.type_page === 'view') {
          console.log('ADD MARKER');
          this.map.clear();
          this.map.addMarker({
            // title: 'My Position',
            title: this.ubication['NOMBRE'],
            icon: 'blue',
            animation: 'DROP',
            position: this.latLng
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
    this.addLocalesMarkers();
  }

  eliminarUbicacion() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present()
    var token = window.localStorage.getItem("userToken");
    var id = this.ubication['ID'];
    try {
      this.httpRequest.post(Constantes.postBorrarDireccionUrl(),
        {
          TOKEN: token,
          ID: this.ubication['ID']
        }).then((res: any) => {
          res = res.json();
          if (res.STATUS != 'OK') {
            console.log(res);
            loading.dismiss();
            this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
          } else {
            // this.navCtrl.push(ListUbicationPage);
            this.navCtrl.setRoot(ListUbicationPage);
            loading.dismiss();
          }
        });
    } catch (err) {
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
          /*handler: () => {
            this.app.getRootNavs()[0].setRoot(HomePage)
        }*/
        }
      ]
    });
    alert.present();
  }

  confirmarBorrado() {
    let alert = this.alertCtrl.create({
      title: 'Confirmar Borrado',
      message: '¿Desea eliminar permanentemente esta dirección?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.navCtrl.setRoot(ListUbicationPage);
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarUbicacion();
          }
        }
      ]
    });
    alert.present();
  }

  guardarForm() {
    if (this.marker !== null) {
      this.navCtrl.push(SetUbicationPage, {
        data: this.marker
      })
    }
  }


  confirmarDireccion(){
    console.log("coordenada "+this.coordenada)
    console.log(this.poligonoId)
    if (this.coordenada !== null && this.poligonoId !== null) {
      console.log("boton click")
      /*  --------------------------------------FLUJO  HACIA  FORMA DE PAGO ------------------------- */
      this.irFormaDePago();
    }
  }

  getUbications() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present()
    var token = window.localStorage.getItem("userToken");
    try {
      console.log(Constantes.getListaDireccionesUrl(token))
      this.httpRequest.get(Constantes.getListaDireccionesUrl(token)).then((res: any) => {
        res = res.json();
        // let data = res.DIRECCIONES
        //  OTRA SOLUCION MAS MEJOR :v
        if (res.STATUS != 'OK') {
          console.log(res);
          loading.dismiss();
          this.mostrarMensaje(Constantes.ALGO_ANDA_MAL, Constantes.INTENTALO_NUEVAMENTE);
        } else {
          this.ubications_list = res["DIRECCIONES"];
          console.log('LIST:', this.ubications_list);
          loading.dismiss();
        }
      });
    } catch (err) {
      this.mostrarMensaje(Constantes.SIN_CONEXION, Constantes.REVISAR_CONEXION);
    }
  }

  setMarkerDirection(data) {
    let nombre = data['NOMBRE'];
    let latLng = {
      lat: 0.0,
      lng: 0.0
    }
    latLng = {
      lat: +data['LATITUD'],
      lng: +data['LONGITUD']
    }
    console.log('data data', latLng);
    this.addLocalesMarkers();
    this.isInPoligono(latLng);


  }



  isInPoligono(coordenada) {
    for (let poligono of this.poligonos) {  // recorre -> [{'ID':1, 'COORDENADAS': [{lat: ..., lng: ...}, {}..]}]
      let contain = Poly.containsLocation(
        coordenada, poligono['COORDENADAS']);
      if (contain) {
        console.log('CON COBERTURA');
        this.map.addMarker({
          icon: 'red',
          position: coordenada
        })
        this.map.animateCamera({
          target: coordenada,
          zoom: 17,
          duration: 5000
        });
        return poligono['ID'];
      }
    }
    console.log('SIN COBERTURA');
    const toast = this.toastCtrl.create({
      message: 'No esta dentro de la cobertura de nuestros locales',
      duration: 3000,
      position: 'top'
    });
    toast.present();

    if (this.type_page === 'set') {
      this.map.addMarker({
        icon: 'red',
        position: coordenada
      })
      this.map.animateCamera({
        target: coordenada,
        zoom: 17,
        duration: 5000
      });
    }
    return null
  }

  addLocalesMarkers() {
    var data = [];
    let snippet = '';
    let title = '';
    this.poligonos = [];
    for (var i = 0; i < this.locales.length; i++) {
      // console.log(this.locales);
      let poligon_dic = {};
      let poligon = [];
      title = this.locales[i]['SECTOR'] + ' | ' + this.locales[i]['CIUDAD'];
      snippet = 'Apertura: ' + this.locales[i]['APERTURA'] + '|Cierre: ' + this.locales[i]['CIERRE'];
      console.log(title);
      console.log(snippet);
      this.map.addMarker({
        // icon: 'blue',
        icon: {
          url: './assets/imgs/pizza_marker.png',
          size: {
            width: 30,
            height: 30
          }
        },
        position: {
          lat: this.locales[i]['COORDENADAS_LOCAL']['LAT'],
          lng: this.locales[i]['COORDENADAS_LOCAL']['LNG']
        },
        title: title,
        snippet: snippet
      })
      for (var j = 0; j < this.locales[i]['POLIGONO']['COORDENADAS'].length; j++) {
        // console.log(this.locales[i]['POLIGONO']['COORDENADAS'][j]);
        let coor = {
          lat: +this.locales[i]['POLIGONO']['COORDENADAS'][j]['LAT'],
          lng: +this.locales[i]['POLIGONO']['COORDENADAS'][j]['LNG']
        }
        poligon.push(coor)
      }
      poligon_dic['ID'] = this.locales[i]['POLIGONO']['ID'];
      poligon_dic['COORDENADAS'] = poligon;
      this.poligonos.push(poligon_dic);
    }
    // console.log(this.poligonos);
  }

  irFormaDePago(){
    let pizzas = this.navParams.get("pizzas");
    let adicionales = this.navParams.get("adicionales");
    let combos = this.navParams.get("combos");
    console.log(this.poligonoId)
    this.navCtrl.push(FormaPagoPage , {
      pizzas : pizzas,
      adicionales : adicionales,
      combos : combos,
      coordenada : this.coordenada  , //-----------------> coordenadas  lat  , lng
      poligono :  this.poligonoId

    });
  }
}
