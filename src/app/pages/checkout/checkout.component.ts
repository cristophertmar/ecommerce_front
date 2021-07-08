import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { SharedService } from 'src/app/services/shared.service';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { Orden } from '../../models/orden.model';
import { UsuarioEntrega } from '../../models/usuario_entrega.model';
import { DireccionEntrega } from '../../models/direccion_entrega.model';
import { OrdenDetalle } from '../../models/orden_detalle.model';
import { OrdenService } from '../../services/orden.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styles: [
  ]
})
export class CheckoutComponent implements OnInit {

  formulario: FormGroup;

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];

  estado: number = 0;

  constructor(
    private _usuarioService: UsuarioService,
    private _ubigeoService: UbigeoService,
    public _productoService: ProductoService,
    private _ordenService: OrdenService,
    private _shared: SharedService,
    private _router: Router,
    private _spinner: NgxSpinnerService
  ) {

  }

  ngOnInit(): void {
    this.crear_form();  
    this.listar_departamento();
    this.departamento_listener();
    this.provincia_listener(); 
    this.setear_form();
  }

  listar_departamento() {
    this._ubigeoService.listar_departamentos()
    .subscribe((resp: any) => {
        this.departamentos = resp.data;
    });
  }

  listar_provincia(departamento: string) {
    this._ubigeoService.listar_provincia(departamento)
    .subscribe((resp: any) => {
      this.provincias = resp.data;
      this.listar_distrito(departamento, this.formulario.value.provincia);
    });
  }

  listar_distrito(departamento: string, provincia) {
    this._ubigeoService.listar_distrito(departamento, provincia)
    .subscribe((resp: any) => {
      this.distritos = resp.data;
  });
  }

  departamento_listener() {
    this.formulario.get('departamento').valueChanges.subscribe((departamento: string) => {
      this.listar_provincia(departamento);
    });
  }

  provincia_listener() {
    this.formulario.get('provincia').valueChanges.subscribe((provincia: string) => {
      const departamento = this.formulario.value.departamento;
      this.listar_distrito(departamento, provincia);
    });
  }

  crear_form() {
    this.formulario = new FormGroup({
      ruc: new FormControl(this._usuarioService.usuario.ruc, [Validators.required, Validators.minLength(10)]),
      nombre: new FormControl(this._usuarioService.usuario.nombre, [Validators.required, Validators.minLength(3)]),
      correo: new FormControl(this._usuarioService.usuario.correo, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      telefono1: new FormControl(this._usuarioService.usuario.telefono1, [Validators.required, Validators.minLength(9)]),
      departamento: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
      provincia: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
      distrito: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),      
      direccion: new FormControl(this._usuarioService.usuario.direccion, [Validators.required, Validators.minLength(3)]),
      numero: new FormControl(this._usuarioService.usuario.numero, [Validators.required]),
      piso: new FormControl(this._usuarioService.usuario.piso, [Validators.required]),
      referencia: new FormControl(this._usuarioService.usuario.referencia, [Validators.required])      
    });
  }

  get rucNoValida() {
    return this.formulario.get('ruc').invalid && this.formulario.get('ruc').touched;
  }

  get nombreNoValida() {
    return this.formulario.get('nombre').invalid && this.formulario.get('nombre').touched;
  }

  get correoNoValida() {
    return this.formulario.get('correo').invalid && this.formulario.get('correo').touched;
  }

  get telefono1NoValida() {
    return this.formulario.get('telefono1').invalid && this.formulario.get('telefono1').touched;
  }

  get departamentoNoValida() {
    return this.formulario.get('departamento').invalid && this.formulario.get('departamento').touched;
  }

  get provinciaNoValida() {
    return this.formulario.get('provincia').invalid && this.formulario.get('provincia').touched;
  }

  get distritoNoValida() {
    return this.formulario.get('distrito').invalid && this.formulario.get('distrito').touched;
  }

  get direccionNoValida() {
    return this.formulario.get('direccion').invalid && this.formulario.get('direccion').touched;
  }

  get numeroNoValida() {
    return this.formulario.get('numero').invalid && this.formulario.get('numero').touched;
  }

  get pisoNoValida() {
    return this.formulario.get('piso').invalid && this.formulario.get('piso').touched;
  }

  setear_form() {

    console.log(this._usuarioService.usuario);

    this.formulario.setValue ({
      ruc: this._usuarioService.usuario.ruc,
      nombre: this._usuarioService.usuario.nombre,
      correo: this._usuarioService.usuario.correo,
      telefono1: this._usuarioService.usuario.telefono1,
      departamento: this._usuarioService.usuario.ubigeo ? this._usuarioService.usuario.ubigeo.departamento : 0,
      provincia: this._usuarioService.usuario.ubigeo ?  this._usuarioService.usuario.ubigeo.provincia : 0,
      distrito: this._usuarioService.usuario.ubigeo ? this._usuarioService.usuario.ubigeo.distrito : 0,
      direccion: this._usuarioService.usuario.direccion,
      numero: this._usuarioService.usuario.numero,
      piso: this._usuarioService.usuario.piso,
      referencia: this._usuarioService.usuario.referencia
    });
  }


  generar_orden() {

    if ( this.formulario.invalid ) {
      this._shared.alert_error('Debe llenar correctamente el fomulario');
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    } else if(this.estado === 0) {
      this._shared.alert_error('Debe seleccionar una forma de pago');
      return;
    }

    let detalles: OrdenDetalle[] = [];

    let usuario = new UsuarioEntrega();
    usuario.ruc = this.formulario.value.ruc;
    usuario.nombre = this.formulario.value.nombre;
    usuario.correo = this.formulario.value.correo;
    usuario.telefono1 = this.formulario.value.telefono1;

    let direccion = new DireccionEntrega();
    direccion.departamento = this.formulario.value.departamento;
    direccion.provincia = this.formulario.value.provincia;
    direccion.distrito = this.formulario.value.distrito;
    direccion.direccion = this.formulario.value.direccion;
    direccion.numero = this.formulario.value.numero;
    direccion.piso = this.formulario.value.piso;
    direccion.referencia = this.formulario.value.referencia;

    let orden = new Orden(); 
    orden.id_usuario = this._usuarioService.usuario.id;
    orden.monto = this._productoService.subtotal;
    orden.usuario_entrega = JSON.stringify(usuario);
    orden.direccion_entrega = JSON.stringify(direccion);

    this._productoService.productos.forEach(producto => {
        let orden_detalle = new OrdenDetalle();
        orden_detalle.producto_id = producto.id;
        orden_detalle.precio_unitario = producto.precio;
        orden_detalle.cantidad_compra = producto.cantidad_comprar;
        orden_detalle.subtotal = producto.monto;

        detalles.push(orden_detalle);
    });


    orden.detalles = detalles;

    /* console.log('orden', orden);
    console.log('estado', this.estado);
    console.log('correo', this.formulario.value.correo); */
    this._spinner.show();
    this._ordenService.generar_orden(orden, this.estado, this.formulario.value.correo)
    .subscribe(
      (resp: any) => {
      this._spinner.hide();
      this.limpiar_carrito();
      this._shared.alert_success(resp.message);
      this.retornar_lista();
      },
      (error) => {
        this._spinner.hide();
      }
    )
  }

  retornar_lista() {
    this._router.navigate(['/productos']);
  }

  limpiar_carrito() {
    this._productoService.productos = [];
    this._productoService.guardar_carrito_local(this._productoService.productos);

  }

  obtener_estado(estado: number) {
    this.estado = Number(estado);
  }



}
