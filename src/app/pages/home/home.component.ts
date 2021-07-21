import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../../services/script.service';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { FiltroTienda } from '../../models/filtro_tienda.model';
import { MultimediaService } from '../../services/multimedia.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  multimedia_destacados: Producto[] = [];
  multimedia_ofertas: Producto[] = [];

  productos_destacados = [];
  productos_destacados_1: Producto[] = [];
  productos_destacados_2: Producto[] = [];
  productos_destacados_3: Producto[] = []; 

  productos_ofertas: Producto[] = [];  
  contador_productos_oferta: number = 0
  productos_ofertas_1: Producto = {}
  productos_ofertas_2: Producto = {}
  productos_ofertas_3: Producto = {}
  productos_ofertas_4: Producto = {}
  productos_ofertas_5: Producto = {}
  productos_ofertas_6: Producto = {}
  
  productos_nuevos: Producto[] = [];
  contador_productos_nuevos: number = 0
  productos_nuevo_1: Producto = {}
  productos_nuevo_2: Producto = {}
  productos_nuevo_3: Producto = {}
  productos_nuevo_4: Producto = {}
  productos_nuevo_5: Producto = {}

  productos_mayor_vendidos = [];
  contador_productos_mayor_vendido: number = 0
  productos_mayor_vendido_1: Producto;
  productos_mayor_vendido_2: Producto;
  productos_mayor_vendido_3: Producto;
  productos_mayor_vendido_4: Producto;

  constructor(
    private _scriptService: ScriptService,
    private _productoService: ProductoService,
    private _multimediaService: MultimediaService,
    private _shared: SharedService,
    private _router: Router
  ) { 
    this._scriptService.script_load(['main']);
  }

  ngOnInit(): void {
    this.listar_multimedia_destacados();
    this.listar_multimedia_ofertas();
    this.listar_productos_nuevos();
    this.listar_mayor_vendido();
  }

  obtener_imagen(ruta: string) {
    return URL_SERVICIOS + ruta;
  }

  listar_multimedia_destacados() {
    this._multimediaService.listar_multimedia('DESTACADO')
    .subscribe( (resp: any) => {
      this.multimedia_destacados = JSON.parse(resp.data[0].contenido);
      this.multimedia_destacados.forEach(producto => {
        this.obtener_producto_destacado(producto.id)
      });
    });
  }

  listar_multimedia_ofertas() {
    this._multimediaService.listar_multimedia('OFERTA')
    .subscribe( (resp: any) => {
      this.multimedia_ofertas = JSON.parse(resp.data[0].contenido);
      this.multimedia_ofertas.forEach(producto => {
        this.obtener_producto_ofertas(producto.id)
      });
    });
  }


  obtener_producto_destacado(token: string) {
    this._productoService.obtener_producto(token)
    .subscribe((resp: any) => {

        switch (true) {
          case this.productos_destacados_1.length < 2:
            this.productos_destacados_1.push(resp.data);
            break;
          case this.productos_destacados_2.length < 2:
            this.productos_destacados_2.push(resp.data);
            break;
          default:
            this.productos_destacados_3.push(resp.data);
            break;
        }
        
    });
  }


  obtener_producto_ofertas(token: string) {
    this._productoService.obtener_producto(token)
    .subscribe((resp: any) => {

      this.contador_productos_oferta += 1;

      switch (this.contador_productos_oferta) {
        case 1:
          this.productos_ofertas_1 = resp.data;
          break;
        case 2:
          this.productos_ofertas_2 = resp.data;
          break;
        case 3:
          this.productos_ofertas_3 = resp.data;
          break;
        case 4:
          this.productos_ofertas_4 = resp.data;
          break;
        case 5:
          this.productos_ofertas_5 = resp.data;
          break;
        default:
          this.productos_ofertas_6 = resp.data;
          break;
      }      

    });
  }

  listar_mayor_vendido() {
    this._productoService.listar_mayor_vendido()
    .subscribe((resp: any)=> {
      this.productos_mayor_vendidos = resp.data;
      this.productos_mayor_vendidos.forEach( producto => {
         this.obtener_producto_mayor_vendido(producto.producto_id)
      });
    });
  }

  obtener_producto_mayor_vendido(token: string) {
    this._productoService.obtener_producto(token)
    .subscribe((resp: any) => {
      
      this.contador_productos_mayor_vendido += 1;
      switch (this.contador_productos_mayor_vendido) {
        case 1:
          this.productos_mayor_vendido_1 = new Producto();
          this.productos_mayor_vendido_1 = resp.data;    
          console.log(this.productos_mayor_vendido_1);
          break;
        case 2:
          this.productos_mayor_vendido_2 = new Producto();
          this.productos_mayor_vendido_2 = resp.data;
          break;
        case 3:
          this.productos_mayor_vendido_3 = new Producto();
          this.productos_mayor_vendido_3 = resp.data;
          break;
          default:
          this.productos_mayor_vendido_4 = new Producto();
          this.productos_mayor_vendido_4 = resp.data;
          break;
      }

      console.clear();
      console.log('4464', this.productos_ofertas_1);

    });
  }



  listar_productos_nuevos() {
    const filtro_tienda = new FiltroTienda(0,5,2);
    this._productoService.listar_producto_tienda(filtro_tienda)
    .subscribe((resp: any) => {

      this.productos_nuevos = resp.data;

      this.productos_nuevos.forEach(producto => {        

        this.contador_productos_nuevos += 1;        
      
        switch (true) {
          case this.contador_productos_nuevos == 1:
            this.productos_nuevo_1 = producto;     
            break;
          case this.contador_productos_nuevos == 2:
            this.productos_nuevo_2 = producto;
            break;
          case this.contador_productos_nuevos == 3:
            this.productos_nuevo_3 = producto;
            break;
          case this.contador_productos_nuevos == 4:
            this.productos_nuevo_4 = producto;
            break;     
          default:
            this.productos_nuevo_5 = producto;
            break;
        }
        
      });      

    });

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

  ver_producto(producto: Producto) {
    this._router.navigate(['producto-detalle/' + producto.id ]);
  }

  adicionar_favorito(producto: Producto) {

    let favoritos: Producto[] = [];
    favoritos.push(producto);

    this._productoService.guardar_favorito_local(favoritos);
    this._shared.alert_toast_success('Añadido a favoritos');
  }

}
