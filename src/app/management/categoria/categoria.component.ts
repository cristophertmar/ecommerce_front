import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styles: [
  ]
})
export class CategoriaComponent implements OnInit {

  formulario: FormGroup;
  form_busqueda: FormGroup;

  pagina_actual: number = 1;
  categoria: Categoria;
  categorias: Categoria[];
  editar: boolean;

  constructor(
    private _categoriaService: CategoriaService,
    private _shared: SharedService,
    private _spinner: NgxSpinnerService
  ) {
    this.crearFormulario();
    this.categorias = [];
    this.editar = false;
  }

  ngOnInit(): void {
    this.listar_categoria();
  }

  limpiar() {
    this.form_busqueda.reset();
    this.listar_categoria();
  }

  listar_categoria() {
    this._spinner.show();
    this._categoriaService.listar_categoria(this.form_busqueda.value.patron_busqueda || '')
    .subscribe((resp: any) => {
      this.categorias = resp.data;
      this._spinner.hide();
    });
  }

  guardar_categoria() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      this._spinner.show();
      this._categoriaService.insertar_categoria(this.categoria)
      .subscribe(resp => {
          this.listar_categoria();
          this.habilitar_nuevo_registro();
          this._spinner.hide();
          this._shared.alert_success('Agregado existosamente');
      });
    }
  }

  actualizar_categoria() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      this._spinner.show();
      this._categoriaService.actualizar_categoria(this.categoria)
      .subscribe(resp => {
        this.listar_categoria();
        this.habilitar_nuevo_registro();
        this.listar_categoria();
        this._spinner.hide();
        this._shared.alert_success('Actualizado existosamente');
      });
    }    
  }

  eliminar_categoria(categoria: Categoria) {
    this._spinner.show();
    this._categoriaService.eliminar_categoria(categoria.id)
    .subscribe(resp => {
      this.listar_categoria();
      this._spinner.hide();
      this._shared.alert_success('Categoría eliminada');
    });
  }

  habilitar_edicion(categoria: Categoria) {
    this.editar = true;
    this.setear_formulario(categoria.id, categoria.nombre_categoria);    
  }

  habilitar_nuevo_registro() {
    this.editar = false;
    this.formulario.reset();  
  }

  obtener_datos_formulario() {
    this.categoria = new Categoria();
    this.categoria.id = this.formulario.get('id').value || 0;
    this.categoria.nombre_categoria = this.formulario.get('nombre_categoria').value;
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
        nombre_categoria: new FormControl(null, [Validators.required])
    });
    this.form_busqueda = new FormGroup({
      patron_busqueda: new FormControl('')
    });
  }

  setear_formulario(id: number, nom: string) {
    this.formulario.setValue({
      id: id,
      nombre_categoria: nom
    })
  }

  get categoriaNoValida() {
    return this.formulario.get('nombre_categoria').invalid && this.formulario.get('nombre_categoria').touched;
  }

}
