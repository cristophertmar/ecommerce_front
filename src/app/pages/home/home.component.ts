import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../../services/script.service';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { FiltroTienda } from '../../models/filtro_tienda.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  productos_oferta: Producto[];
  productos_vistos: Producto[];
  productos_nuevos: Producto[];

  constructor(
    private _scriptService: ScriptService,
    private _productoService: ProductoService
  ) { 
    this._scriptService.script_load(['main']);
  }

  ngOnInit(): void {
    this.listar_productos_oferta();
    this.listar_productos_vistos();
    this.listar_productos_nuevos();
  }

  listar_productos_oferta() {
    const filtro_tienda = new FiltroTienda(1,6,1);
    this._productoService.listar_producto_tienda(filtro_tienda)
    .subscribe((resp: any) => {
        this.productos_oferta = resp.data;
        console.log(this.productos_oferta);
    });
  }

  listar_productos_vistos() {
    const filtro_tienda = new FiltroTienda(0,4,1);
    this._productoService.listar_producto_tienda(filtro_tienda)
    .subscribe((resp: any) => {
        this.productos_vistos = resp.data;
        console.log(this.productos_vistos);
    });
  }

  listar_productos_nuevos() {
    const filtro_tienda = new FiltroTienda(0,5,2);
    this._productoService.listar_producto_tienda(filtro_tienda)
    .subscribe((resp: any) => {
        this.productos_nuevos = resp.data;
        console.log(this.productos_nuevos);
    });
  }

}
