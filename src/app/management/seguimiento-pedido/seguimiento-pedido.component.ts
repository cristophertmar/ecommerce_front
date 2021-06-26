import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Orden } from 'src/app/models/orden.model';
import { OrdenService } from '../../services/orden.service';

@Component({
  selector: 'app-seguimiento-pedido',
  templateUrl: './seguimiento-pedido.component.html',
  styles: [
  ]
})
export class SeguimientoPedidoComponent implements OnInit {

  form_busqueda: FormGroup;
  ordenes: Orden[] = [];

  constructor(
    private _ordenService: OrdenService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.crear_formulario();
    this.listar_orden();
  }

  crear_formulario() {
    this.form_busqueda = new FormGroup({
      estado: new FormControl(1, [Validators.required]),
      patron_busqueda: new FormControl(''),
      fecha_ini: new FormControl(''),
      fecha_fin: new FormControl(''),
    });
  }

  listar_orden() {
    
    const estado = Number(this.form_busqueda.value.estado);
    this.form_busqueda.value.estado = estado;

    this._ordenService.listar_orden(this.form_busqueda.value)
    .subscribe((resp: any) => {
        this.ordenes = resp.data;
        this.ordenes.forEach(orden => {
          orden.usuario_entrega_obj = JSON.parse(orden.usuario_entrega);
          orden.direccion_entrega_obj = JSON.parse(orden.direccion_entrega);
        });
    });
  }

  editar_orden(orden: Orden) {
    this._router.navigate(['/mantenimiento/seguimiento-pedido/' + orden.id ]);
  }

}
