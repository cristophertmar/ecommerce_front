import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ScriptService } from 'src/app/services/script.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [
  ]
})
export class CartComponent implements OnInit {

  constructor(
    public _productoService: ProductoService,
    private _router: Router,
    private _scriptService: ScriptService
  ) {
    this._scriptService.script_load(['vendor.min', 'plugins.min', 'main']);
   }

  ngOnInit(): void {

  }

  modificar_cantidad(i: number) {
    this._productoService.productos[i].monto = (this._productoService.productos[i].cantidad_comprar * this._productoService.productos[i].precio);
    this._productoService.calcular_subtotal();
  }

  eliminar_item(i: number) {
    this._productoService.productos.splice(i, 1);
    this._productoService.guardar_carrito_local(this._productoService.productos);
    /* this._productoService.carrito$.emit(this.carrito); */
  }

  obtener_imagen(ruta: string) {
    return URL_SERVICIOS + ruta;
  }

  limpiar_carrito() {
    this._productoService.productos = [];
    this._productoService.guardar_carrito_local(this._productoService.productos);
  }

  retornar_lista() {
    this._router.navigate(['/productos']);
  }

  aumentar_cantidad(i: number) {
    this._productoService.productos[i].cantidad_comprar += 1;
    this.modificar_cantidad(i);
  }

  disminuir_cantidad(i: number) {
    if(this._productoService.productos[i].cantidad_comprar != 1) {
      this._productoService.productos[i].cantidad_comprar -= 1;
    } else{
      this._productoService.productos[i].cantidad_comprar = 1;
    }    
    this.modificar_cantidad(i);
  }

}
