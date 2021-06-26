import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styles: [
  ]
})
export class ProductoComponent implements OnInit {

  pagina_actual: number = 1;
  productos: Producto[];

  constructor(
    private _productoService: ProductoService,
    private _router: Router
  ) { 
    this.productos = [];
  }

  ngOnInit(): void {
    this.listar_producto();
  }

  nuevo_producto() {
    this._router.navigate(['/mantenimiento/producto/nuevo']);
  }

  editar_producto(producto: Producto) {
    this._router.navigate(['/mantenimiento/producto/' + producto.id ]);
  }

  listar_producto() {
    this._productoService.listar_producto()
    .subscribe((resp: any) => {
      this.productos =  resp.data;
      /* console.log(this.productos); */
    });
  }

  


}
