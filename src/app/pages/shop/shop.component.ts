import { Component, OnDestroy, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { Subcategoria } from '../../models/subcategoria.model';
import { Tipo } from '../../models/tipo.model';
import { CategoriaService } from '../../services/categoria.service';
import { SubCategoriaService } from '../../services/sub-categoria.service';
import { TipoService } from '../../services/tipo.service';
import { FiltroTienda } from '../../models/filtro_tienda.model';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styles: [
  ]
})
export class ShopComponent implements OnInit, OnDestroy {

  categorias_filtro: Categoria[];
  subcategorias_filtro: Subcategoria[];
  tipos_filtro: Tipo[];

  categorias: Categoria[];
  subcategorias: Subcategoria[];
  tipos: Tipo[];

  precio_min: number = null;
  precio_max = null;
  orden_lista = 1;
  pagina: number = 1;
  cantxpagina: number = 6;

  pagina_final: number = 1;


  filtro_tienda: FiltroTienda;
  productos: Producto[];

  id_categoria_filtro: number = 0;

  constructor(
    private _categoriaService: CategoriaService,
    private _subcategoriaService: SubCategoriaService,
    private _tipoService: TipoService,
    private _productoService: ProductoService,
    private _router: Router,
    private _shared: SharedService
  ) {
    this.categorias_filtro = [];
    this.subcategorias_filtro = [];
    this.tipos_filtro = [];
    this.categorias = [];
    this.subcategorias = [];
    this.tipos = [];
    this.productos = [];
  }
  ngOnDestroy(): void {
    this._productoService.guardar_categoria(0);
  }

  ngOnInit(): void {
    this.listar_categoria();
    // this.enviar_filtros();
    this._productoService.id_categoria$
    .subscribe(id => {
      if(this.categorias.length > 0) {
        // this.quitar_filtro_categoria();
        this.categorias_filtro = [];
        this.subcategorias_filtro = [];
        this.subcategorias = [];
        this.tipos_filtro = [];
        this.tipos = [];
        this.enviar_filtros();
        // this.obtener_objeto_categoria();
        //this._productoService.guardar_categoria(0);
      }
    });
  }

  obtener_objeto_categoria() {

  var newArray = this.categorias.filter(categoria => {       
      return categoria.id === this._productoService.id_categoria;
  });

  if(newArray.length > 0) {
    // this.agregar_filtro_categoria(newArray[0]);
    this.categorias_filtro.push(newArray[0]);
    this.listar_subcategoria(newArray[0].id);
  }

  }

  agregar_filtro_categoria(categoria: Categoria) {
    this.categorias_filtro.push(categoria);
    this.listar_subcategoria(categoria.id);
    this.enviar_filtros();
  }

  agregar_filtro_subcategoria(subcategoria: Subcategoria) {
    this.subcategorias_filtro.push(subcategoria);
    this.listar_tipo(subcategoria.id);
    this.enviar_filtros();
  }

  agregar_filtro_tipo(checked: boolean, tipo: Tipo, i: number) {
    this.tipos[i].checked = checked;
    tipo.index = i;
    if(checked) {
      this.tipos_filtro.push(tipo);
    } else {
      this.tipos_filtro.splice(i,1);
    }    
    this.enviar_filtros();
  }

  quitar_filtro_categoria() {
    this.categorias_filtro = [];
    this.subcategorias_filtro = [];
    this.subcategorias = [];
    this.tipos_filtro = [];
    this.tipos = [];
    this.pagina = 1;
    this._productoService.guardar_categoria(0);
    this.enviar_filtros();
  }

  quitar_filtro_subcategoria() {
    this.subcategorias_filtro = [];
    this.tipos_filtro = [];
    this.tipos = [];
    this.pagina = 1;
    this.enviar_filtros();
  }

  quitar_filtro_tipo(tipo: Tipo, i: number) {
    this.tipos[i].checked = false;
    this.tipos_filtro.splice(i, 1);
    this.pagina = 1;
    this.enviar_filtros();
  }

  listar_categoria() {
    this._categoriaService.listar_categoria()
    .subscribe((resp: any) => {
      this.categorias = resp.data;
      this.enviar_filtros();
      // this.obtener_objeto_categoria();
    });
  }

  listar_subcategoria(id_categoria: number) {
    this._subcategoriaService.listar_subcategoria(id_categoria)
    .subscribe((resp: any) => {
      this.subcategorias = resp.data;
    });
  }

  listar_tipo(id_subcategoria: number) {
    this._tipoService.listar_tipo(id_subcategoria)
    .subscribe((resp: any) => {      
      resp.data.forEach(tipo => { tipo.checked = false });
      this.tipos = resp.data;
    });
  }



  enviar_filtros(recargar: boolean = false) {

    this.obtener_objeto_categoria();

    this.filtro_tienda = new FiltroTienda();

    this.filtro_tienda.id_categoria = this.categorias_filtro[0] ?  this.categorias_filtro[0].id : 0;
    this.filtro_tienda.id_sub_categoria = this.subcategorias_filtro[0] ? this.subcategorias_filtro[0].id : 0;
    this.filtro_tienda.nombre_tipo = this.obtener_nombres_tipo_filtro();
    this.filtro_tienda.precio_min = this.precio_min;
    this.filtro_tienda.precio_max = this.precio_max;
    this.filtro_tienda.orden_lista = Number(this.orden_lista);
    this.filtro_tienda.pagina = this.pagina;
    this.filtro_tienda.cantxpagina = this.cantxpagina;

    /* console.log(this.filtro_tienda); */
    
    this._productoService.listar_producto_tienda(this.filtro_tienda, this._productoService.patron_busqueda)
    .subscribe((resp: any) => {

      let cant_registros: number = 0;
      const { isSuccess, message, data } = resp

      if(recargar) {
        this.productos = [...this.productos, ...data];            
      } else {
        this.productos = data;
      }      

      cant_registros = (this.productos.length > 0 ?  resp.data[0].total_registros : 0);    
      this._productoService.patron_busqueda = '';
      this.pagina_final = Math.ceil(cant_registros / this.cantxpagina);

    });

  }

  obtener_nombres_tipo_filtro() {
    let tipos_string: string[] =  [];
    this.tipos_filtro.forEach(tipo => {
        tipos_string.push(tipo.nombre_tipo);
    });
    return tipos_string.length === 0 ? '' : JSON.stringify(tipos_string);
  }

  obtener_imagen(ruta: string) {
    return URL_SERVICIOS + ruta;
  }

  ver_producto(producto: Producto) {
    this._router.navigate(['producto-detalle/' + producto.id ]);
  }

  adicionar_carrito(producto_agregar: Producto) {   

    producto_agregar.cantidad_comprar = 1;
    producto_agregar.monto = producto_agregar.precio;

    let nuevo_producto: boolean = true;
    let carrito_temp: Producto[] = [];

    if(this._productoService.productos.length === 0) {
      carrito_temp.push(producto_agregar);      
      this._productoService.guardar_carrito_local(carrito_temp);
      return;
    }

    this._productoService.productos.forEach(producto => {

      if(producto.id === producto_agregar.id) {
        producto.cantidad_comprar += producto_agregar.cantidad_comprar;
        producto.monto += producto_agregar.monto;  
        nuevo_producto = false;
      }

      carrito_temp.push(producto);

    });

    if(nuevo_producto) {
      carrito_temp.push(producto_agregar);
    }

    this._productoService.guardar_carrito_local(carrito_temp);
    this._shared.alert_toast_success('Añadido al carrito');
    
  }

  adicionar_favorito(producto: Producto) {

    let favoritos: Producto[] = [];
    favoritos.push(producto);

    this._productoService.guardar_favorito_local(favoritos);
    this._shared.alert_toast_success('Añadido a favoritos');
  }

  onScrollDown() {
    /* console.log('Down...'); */
    if(this.pagina < this.pagina_final) {
      this.pagina += 1;
      this.enviar_filtros(true);
    }
  }

}
