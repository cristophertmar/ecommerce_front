import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Promocion } from 'src/app/models/promocion.model';
import { SharedService } from 'src/app/services/shared.service';
import { PromocionService } from '../../services/promocion.service';

@Component({
  selector: 'app-promocion',
  templateUrl: './promocion.component.html',
  styles: [
  ]
})
export class PromocionComponent implements OnInit {

  formulario: FormGroup;
  form_busqueda: FormGroup;

  pagina_actual: number = 1;  

  promocion: Promocion;
  promociones: Promocion[];

  estado_promocion: boolean;

  editar: boolean;

  fecha_actual: string = '';

  constructor(
    private _promocionService: PromocionService,
    private _shared: SharedService,
    private _spinner: NgxSpinnerService
  ) {
    this.crearFormulario();
    this.promociones = [];
    this.editar = false;
    this.estado_promocion = true;
  }  

  ngOnInit(): void {
    this.listar_promocion();
    this.obtener_fecha_actual();
  }

  obtener_fecha_actual() {
    const today = new Date();
    this.fecha_actual = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
  }

  obtener_procentaje(cantidad: number): number {
    return cantidad * 100;
  }

  listar_promocion() {
    this._promocionService.listar_promocion(this.form_busqueda.value.patron_busqueda || '')
    .subscribe((resp: any) => {
      this.promociones = resp.data;
    });
  }

  limpiar() {
    this.form_busqueda.reset({patron_busqueda: ''});
    this.listar_promocion();
  }

  guardar_promocion() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      this._spinner.show();
      this._promocionService.insertar_promocion(this.promocion)
      .subscribe(resp => {
          this.listar_promocion();
          this.habilitar_nuevo_registro();
          this._spinner.hide();
          this._shared.alert_success('Agregado existosamente');
      });
    }
  }

  actualizar_promocion() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      this._spinner.show();
      this._promocionService.actualizar_promocion(this.promocion)
      .subscribe(resp => {
        this.listar_promocion();
        this.habilitar_nuevo_registro();
        this._spinner.hide();
        this._shared.alert_success('Actualizado existosamente');
      });
    }    
  }

  eliminar_promocion(promocion: Promocion) {
    this._spinner.show();
    this._promocionService.eliminar_promocion(promocion.id)
    .subscribe(resp => {
      this.listar_promocion();
      this._spinner.hide();
      this._shared.alert_success('Promoción eliminada');
    });
  }

  habilitar_edicion(promocion: Promocion) {
    this.editar = true;
    this.promocion = promocion;
    this.estado_promocion = promocion.estado;
    this.setear_formulario(promocion.id, promocion.descripcion, promocion.porcentaje, promocion.vigencia_inicio, promocion.vigencia_fin);    
  }

  cambiar_estado_producto(estado: boolean) {
    this.estado_promocion = estado;
  }

  habilitar_nuevo_registro() {
    this.editar = false;
    this.formulario.reset({id_categoria: 0, id_subcategoria: 0});  
  }

  obtener_datos_formulario() {
    this.promocion = new Promocion();
    this.promocion.id = this.formulario.get('id').value || 0;
    this.promocion.descripcion = this.formulario.get('descripcion').value;
    this.promocion.porcentaje =  (Number(this.formulario.get('porcentaje').value) / 100);
    this.promocion.estado = this.estado_promocion;
    this.promocion.vigencia_inicio = this.formulario.get('vigencia_inicio').value;
    this.promocion.vigencia_fin = this.formulario.get('vigencia_fin').value;
  }

  pasar_validacion(): boolean {
    if(this.formulario.invalid){
      this._shared.alert_error('Llene correctamente el formulario');
      Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
      return false;
    }
    return true;
  }

  crearFormulario(){
    this.formulario = new FormGroup({
        id: new FormControl(null),
        descripcion: new FormControl(null, [Validators.required]),
        porcentaje: new FormControl(null, [Validators.required]),
        vigencia_inicio: new FormControl(null, [Validators.required]),
        vigencia_fin: new FormControl(null, [Validators.required])
    });
    this.form_busqueda = new FormGroup({
      patron_busqueda: new FormControl('')
    });
  }

  setear_formulario(id: number, desc: string, porcent: number, vigencia_inicio: string, vigencia_fin: string) {
    this.formulario.setValue({
      id: id,
      descripcion: desc,
      porcentaje: this.obtener_procentaje(porcent),
      vigencia_inicio: vigencia_inicio,
      vigencia_fin: vigencia_fin
    })
  }

  get promocionNoValida() {
    return this.formulario.get('descripcion').invalid && this.formulario.get('descripcion').touched;
  }

  get descuentoNoValido() {
    return this.formulario.get('porcentaje').invalid && this.formulario.get('porcentaje').touched;
  }

  get vigenciaInicioNoValido() {
    return this.formulario.get('vigencia_inicio').invalid && this.formulario.get('vigencia_inicio').touched;
  }

  get vigenciaFinNoValido() {
    return this.formulario.get('vigencia_fin').invalid && this.formulario.get('vigencia_fin').touched;
  }

}
