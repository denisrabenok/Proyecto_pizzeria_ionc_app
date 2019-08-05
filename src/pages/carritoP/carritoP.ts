import { Component } from '@angular/core';
import { Nav, IonicPage, NavController, NavParams,InfiniteScroll  } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { ViewChild } from '@angular/core';
import { ValoresPage  } from '../valores/valores';



import 'rxjs/add/operator/map';



@IonicPage()
@Component({
  selector: 'page-carritoP',
  templateUrl: 'carritoP.html',
})
export class CarritoPPage {
  carritoPs: any;
  productos: any;
  totalCarrito : number = 0;




  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Nav) nav: Nav;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private carritoPProvider: ApiServiceProvider) {
    this.getProductos();
    
    
  }

  getTotal(){
    this.totalCarrito = 0;
    for (let p of this.productos){
      this.totalCarrito += Number(p.precio) * Number(p.cantidad);
    }
    console.log(this.totalCarrito);
  }

  getProductos() {
    this.carritoPProvider.getProductos()
    .then(data => {
      this.productos = data;
      console.log(this.productos);
      this.getTotal();
      for (let producto of this.productos){
        producto['select'] = false;
      }
    });
  }

  async addCantidad(event, producto) {
                
    const productoAdd = {
        nombre: producto.nombre,
        precio: producto.precio,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad + 1,
    };
            
    await this.carritoPProvider.setProducto(producto.idP, productoAdd);
    this.getProductos();    
}

async removeCantidad(event, producto) {
                
  const productoAdd = {
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      cantidad: producto.cantidad - 1,
  };

  if (producto.cantidad > 1){
    await this.carritoPProvider.setProducto(producto.idP, productoAdd);
    this.getProductos();
  }
}

  async eliminarProducto(event, productoId) {
    await this.carritoPProvider.deleteProducto(productoId); 
    this.getProductos(); 
  }


  goPage(){
    
    this.navCtrl.setRoot(ValoresPage)
  }




}
