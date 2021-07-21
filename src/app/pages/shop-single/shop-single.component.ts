import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { URL_SERVICIOS } from 'src/app/config/config';
/* import { Subscription } from 'rxjs'; */
import { SharedService } from '../../services/shared.service';
import { ScriptService } from 'src/app/services/script.service';

@Component({
  selector: 'app-shop-single',
  templateUrl: './shop-single.component.html',
  styles: [
  ]
})
export class ShopSingleComponent implements OnInit {

  carrito: Producto[];
  /* carrito_subscripcion: Subscription; */
  producto: Producto;
  productos_relacionados: Producto[];
  cantidad_comprar: number = 1;

  constructor(
    private _productoService: ProductoService,
    private _activatedRoute: ActivatedRoute,
    private _shared: SharedService,
    private _scriptService: ScriptService,
    private _router: Router
  ) {
    this.producto = {};
    this.productos_relacionados = [];
    
  }
  
  ngOnInit(): void {
    this._activatedRoute.params.subscribe( ({token}) => {
       this.obtener_producto(token);
    });    
    /* this.carrito_subscripcion = this._productoService.carrito$
    .subscribe(carrito => {
      this.carrito = carrito;
      console.log('lalala', this.carrito);
    }); */
  }

  /* ngOnDestroy(): void {
     this.carrito_subscripcion.unsubscribe();
  } */

  refrescar(): void {
    window.location.reload();
  }

  obtener_producto(token: string) {
    this._productoService.obtener_producto(token)
    .subscribe((resp: any) => {        
        let productos_asociados = [];
        resp.data.cantidad_comprar = 1;
        resp.data.monto =  resp.data.precio;
        this.producto = resp.data;
        productos_asociados = JSON.parse(this.producto.producto_asociado);
        productos_asociados.forEach(prod => {
          this.obtener_producto_relacionado(prod.id)
        });
        console.log(this.producto);
    });
  }

  obtener_producto_relacionado(token: string) {
    this._productoService.obtener_producto(token)
    .subscribe((resp: any) => {
        this.productos_relacionados.push(resp.data);
        this._scriptService.script_load(['main']);
    });
  }

  obtener_imagen(ruta: string) {
    return URL_SERVICIOS + ruta;
  }

  adicionar_favorito(producto: Producto) {

    let favoritos: Producto[] = [];
    favoritos.push(producto);

    this._productoService.guardar_favorito_local(favoritos);
    this._shared.alert_toast_success('Añadido a favoritos');
  }

  adicionar_carrito() {

    this.modificar_cantidad();

    let nuevo_producto: boolean = true;
    let carrito_temp: Producto[] = [];

    if(this._productoService.productos.length === 0) {
      carrito_temp.push(this.producto);      
      this._productoService.guardar_carrito_local(carrito_temp);
      return;
    }

    this._productoService.productos.forEach(producto => {

      if(producto.id === this.producto.id) {
        producto.cantidad_comprar += this.producto.cantidad_comprar;
        producto.monto += this.producto.monto;  
        nuevo_producto = false;
      }

      carrito_temp.push(producto);

    });

    if(nuevo_producto) {
      carrito_temp.push(this.producto);
    }

    this._productoService.guardar_carrito_local(carrito_temp);

    this._shared.alert_toast_success('Añadido al carrito');
    
  }

  modificar_cantidad() {
    this.producto.cantidad_comprar = Number((document.getElementById("cantidad") as HTMLInputElement).value);
    this.producto.monto = (this.producto.cantidad_comprar * this.producto.precio);
  }

  aumentar_cantidad() {

    let contador: number = Number((document.getElementById("cantidad") as HTMLInputElement).value);
    contador += 1;
    (document.getElementById("cantidad") as HTMLInputElement).value = contador.toString();
    this.modificar_cantidad();
  }

  disminuir_cantidad() {
    let contador: number = Number((document.getElementById("cantidad") as HTMLInputElement).value);
    if(contador != 1) {
      contador -= 1;
    } else{
      contador = 1;
    }    
    (document.getElementById("cantidad") as HTMLInputElement).value = contador.toString();
    this.modificar_cantidad();
  }

  ver_producto(producto: Producto) {
    this._router.navigate(['producto-detalle/' + producto.id ]);
  }



}
