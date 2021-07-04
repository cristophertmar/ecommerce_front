import { EventEmitter, Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto.model';
import { FiltroTienda } from '../models/filtro_tienda.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  /* carrito$ = new EventEmitter<Producto[]>(); */
  productos: Producto[];
  subtotal: number = 0;
  id_categoria: number = 0;
  patron_busqueda: string = '';

  id_categoria$ = new EventEmitter<number>();

  constructor(
    private _http: HttpClient
  ) { 
    this.productos = [];
    this.cargar_carrito_local();
    this.cargar_categoria_local();
  }

  cargar_carrito_local() {
    if (localStorage.getItem('carrito'))  {
      this.productos = JSON.parse(localStorage.getItem('carrito'));
      //this.carrito$.emit(this.productos);
    } else {
      this.productos = []
    }
    this.calcular_subtotal();
  }

  guardar_carrito_local(carrito: Producto[]) {
    localStorage.removeItem('carrito');
    localStorage.setItem('carrito', JSON.stringify(carrito));
    this.cargar_carrito_local();
  }

  guardar_categoria(id_categoria: number) {
    sessionStorage.removeItem('id_categoria');
    sessionStorage.setItem('id_categoria', id_categoria.toString());
    this.cargar_categoria_local();
  }

  cargar_categoria_local() {
    if (sessionStorage.getItem('id_categoria'))  {
      this.id_categoria = Number(sessionStorage.getItem('id_categoria'));
    } else {
      this.id_categoria = 0;
    }
  }

  calcular_subtotal() {
    this.subtotal = 0;
    this.productos.forEach( producto => {
      this.subtotal += producto.monto;
    });
  }

  //***********************************************************/

  listar_producto(patron_busqueda: string = '', id_categoria: number = 0, id_sub_categoria: number = 0, id_marca: number = 0) {
    const url = URL_SERVICIOS + 'api/producto/listar?patron_busqueda=' + patron_busqueda + '&id_categoria=' 
    + id_categoria + '&id_sub_categoria=' + id_sub_categoria + '&id_marca=' + id_marca;
    return this._http.get(url);
  }

  listar_producto_tienda(filtro: FiltroTienda, patron_busqueda: string = '') {
    const url = URL_SERVICIOS + 'api/producto/listar_tienda?patron_busqueda=' + patron_busqueda;
    return this._http.post(url, filtro);
  }

  obtener_producto(id: string) {
    const url = URL_SERVICIOS + 'api/producto/detalle?id=' + id;
    return this._http.get(url);
  }

  insertar_producto(producto: Producto) {
    const url = URL_SERVICIOS + 'api/producto/guardar';
    return this._http.post(url, producto);
  }

  actualizar_producto(producto: Producto) {
    const url = URL_SERVICIOS + 'api/producto/actualizar';
    return this._http.put(url, producto);
  }

  eliminar_imagen(id: number) {
    const url = URL_SERVICIOS + 'api/producto/imagen_eliminar?id=' + id;
    return this._http.delete(url);
  }

}
 