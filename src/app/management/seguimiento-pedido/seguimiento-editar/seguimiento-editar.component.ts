import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenService } from '../../../services/orden.service';
import { Orden } from '../../../models/orden.model';
import { OrdenCambio } from '../../../models/orden_cambio.model';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-seguimiento-editar',
  templateUrl: './seguimiento-editar.component.html',
  styles: [
  ]
})
export class SeguimientoEditarComponent implements OnInit {

  /* formulario: FormGroup */
  orden: Orden;
  estado: number = 0;
  parcial: boolean = false;

  constructor(
    private _ordenService: OrdenService,
    private _activatedRoute: ActivatedRoute,
    private shared: SharedService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe( ({token}) => {
       this.obtener_orden(token);
    });   
  }

  obtener_control(estado) {
    return estado ? 'Sí' : 'No';
  }
  obtener_orden(id: string) {
      this._ordenService.obtener_orden(id)
      .subscribe((resp: any) => {
        this.orden = new Orden();
        this.orden = resp.data;        
        this.orden.usuario_entrega_obj = JSON.parse(this.orden.usuario_entrega);
        this.orden.direccion_entrega_obj = JSON.parse(this.orden.direccion_entrega); 

        console.log(this.orden);

        this.orden.detalles.forEach( orden => {
            
          if(orden.cantidad_aprobada === 0) {
            orden.cantidad_aprobada = orden.cantidad_compra;
            orden.subtotal_aprobado = orden.subtotal;
          }
            
        });
        
        console.log(this.orden);

      });
  }

  modificar_cantidad(i: number, cantidad: number, control_stock: boolean, stock: number) {

    if(control_stock && (cantidad > stock)) {
      
      cantidad = stock;
      this.shared.alert_info('Para este producto no se puede superar la cantidad de stock');

    }
    
    this.orden.detalles[i].cantidad_aprobada = Number(cantidad);
    this.orden.detalles[i].subtotal_aprobado = (Number(cantidad) * this.orden.detalles[i].precio_unitario);
    this.parcial = this.obtener_parcialidad();
    console.log(this.parcial);
  }

  obtener_parcialidad() {
    let parcialidad = false;
    this.orden.detalles.forEach( prod => {
      if(Number(prod.cantidad_aprobada) !== Number(prod.cantidad_compra)) {
        parcialidad = true;          
      }
    });
    
    return parcialidad;
  }

  obtener_estado(estado: number) {
    this.estado = estado;
  }

  guardar_cambios() {
    if(this.estado === 0) {
      this.shared.alert_error('Seleccione un estado')
      return;
    }

    let orden_cambio = new OrdenCambio();
    orden_cambio.id = this.orden.id;
    orden_cambio.estado = Number(this.estado);
    orden_cambio.detalles = this.orden.detalles;

    console.log(orden_cambio);

    this._ordenService.cambiar_estado_orden(orden_cambio, this.orden.usuario_entrega_obj.correo)
    .subscribe(resp => {
        this.shared.alert_toast_success('Guardado exitosamente');
        this.retornar_lista();
    });
  }

  cambiar_estado(estado: number) {

    let orden = new OrdenCambio();
    orden.id = this.orden.id;
    orden.estado = Number(estado);
    orden.detalles = [];

    this._ordenService.cambiar_estado_orden(orden, this.orden.usuario_entrega_obj.correo)
    .subscribe(resp => {
        console.log(resp);
        this.shared.alert_success('Guardado exitosamente');
        this.retornar_lista();
    });
  }

  retornar_lista() {
    this._router.navigate(['/mantenimiento/seguimiento-pedido']);
  }

}
