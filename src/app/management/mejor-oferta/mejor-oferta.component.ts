import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/producto.service';
import { SharedService } from '../../services/shared.service';
import { MultimediaService } from '../../services/multimedia.service';
import { Multimedia } from '../../models/multimedia.model';

@Component({
  selector: 'app-mejor-oferta',
  templateUrl: './mejor-oferta.component.html',
  styles: [
  ]
})
export class MejorOfertaComponent implements OnInit {

  productos: Producto[] = [];
  productos_asocionados: Producto[] = [];

  multimedias: Multimedia[] = [];

  constructor(
    private _productoService: ProductoService,
    private _multimediaService: MultimediaService,
    private _shared: SharedService
  ) { }

  ngOnInit(): void {
    this.listar_multimedia();
  }

  listar_multimedia() {
    this._multimediaService.listar_multimedia('OFERTA')
    .subscribe( (resp: any) => {
      this.multimedias = resp.data;
      this.productos_asocionados = JSON.parse(this.multimedias[0].contenido);
      console.log(this.productos_asocionados);
    });
  }

  guardar_cambios() {    
    const multimedia = new Multimedia(JSON.stringify(this.productos_asocionados), 'OFERTA', this.multimedias[0].id);
    this._multimediaService.actualizar_multimedia(multimedia)
    .subscribe( (resp: any) => {
      this._shared.alert_success('Guardado Satisfactoriamente');
    });
  }

  listar_producto(patron_busqueda: string) {
    console.log(patron_busqueda);
    this._productoService.listar_producto(patron_busqueda)
    .subscribe((resp: any) => {
      this.productos = resp.data; 
      console.log(this.productos);
    });
  }

  asociar_producto(producto: Producto) {
    if(this.productos_asocionados.length > 5) {
      this._shared.alert_error('Solo pueden asociarse 6 productos');
      return;
    }
    this.productos_asocionados.push(producto);
  }

  eliminar_asociacion_producto(i: number) {
    this.productos_asocionados.splice(i, 1);
  }

}
