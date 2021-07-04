import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Categoria } from 'src/app/models/categoria.model';
import { Producto } from 'src/app/models/producto.model';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoService } from '../../services/producto.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  carrito: Producto[] = [];
  categorias: Categoria[];

  id_categoria: number = 0;

  @ViewChild('btn_desplazar') btn_desplazar: ElementRef<HTMLElement>;
  

  constructor(
    public _usuarioService: UsuarioService,
    private _categoriaService: CategoriaService,    
    public _productoService: ProductoService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.listar_categoria();
    /* this._productoService.carrito$
    .subscribe(carrito => {
      this.carrito = carrito;
      this.calcular_subtotal(this.carrito);
      console.log(this.carrito);
    }); */

  }

  listar_categoria() {
    this._categoriaService.listar_categoria_detallado()
    .subscribe((resp: any) => {        
        this.categorias = resp.data;
    });
  }  

  obtener_imagen(ruta: string) {
    return URL_SERVICIOS + ruta;
  }

  eliminar_item(i: number) {
    this._productoService.productos.splice(i, 1);
    this._productoService.guardar_carrito_local(this._productoService.productos);
    /* this._productoService.carrito$.emit(this.carrito); */
  }

  obtener_categoria(categoria: number) {
    this.id_categoria = Number(categoria);
  }

  seleccionar_categoria(categoria: Categoria) {
    this.id_categoria = categoria.id;
    this.btn_desplazar.nativeElement.click();
    this.buscar_producto(true);
  }

  buscar_producto(seleccion: boolean =  false) {
    this._productoService.guardar_categoria(this.id_categoria);

    seleccion ? this._productoService.patron_busqueda = '' : this._productoService.patron_busqueda = ((document.getElementById('patron_busqueda') as HTMLInputElement).value)

    this._productoService.id_categoria$.emit(this.id_categoria);
    this._router.navigate(['/productos']);
    
  }


}
