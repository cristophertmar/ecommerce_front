import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Categoria } from 'src/app/models/categoria.model';
import { Subcategoria } from 'src/app/models/subcategoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SharedService } from 'src/app/services/shared.service';
import { SubCategoriaService } from '../../services/sub-categoria.service';

@Component({
  selector: 'app-sub-categoria',
  templateUrl: './sub-categoria.component.html',
  styles: [
  ]
})
export class SubCategoriaComponent implements OnInit {

  formulario: FormGroup;

  pagina_actual: number = 1;
  subcategoria: Subcategoria;
  subcategorias: Subcategoria[];
  categorias: Categoria[];
  editar: boolean;

  constructor(
    private _categoriaService: CategoriaService,
    private _subcategoriaService: SubCategoriaService,
    private _shared: SharedService,
    private _spinner: NgxSpinnerService
  ) {
    this.crearFormulario();
    this.subcategorias = [];
    this.editar = false;
  }

  ngOnInit(): void {
    this.listar_categoria();
    this.listar_subcategoria();
  }

  listar_categoria() {
    this._categoriaService.listar_categoria()
    .subscribe((resp: any) => {
      this.categorias = resp.data;
      this.categorias.unshift({
        id: 0,
        nombre_categoria: '(Seleccionar)'
      });
    });
  }

  listar_subcategoria() {
    this._subcategoriaService.listar_subcategoria()
    .subscribe((resp: any) => {
      this.subcategorias = resp.data;
    });
  }

  guardar_subcategoria() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      this._spinner.show();
      this._subcategoriaService.insertar_subcategoria(this.subcategoria)
      .subscribe(resp => {
          this.listar_subcategoria();
          this.habilitar_nuevo_registro();
          this._spinner.hide();
          this._shared.alert_success('Agregado existosamente');
      });
    }
  }

  actualizar_subcategoria() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      this._spinner.show();
      this._subcategoriaService.actualizar_subcategoria(this.subcategoria)
      .subscribe(resp => {
        this.listar_subcategoria();
        this.habilitar_nuevo_registro();
        this.listar_categoria();
        this._spinner.hide();
        this._shared.alert_success('Actualizado existosamente');
      });
    }    
  }

  eliminar_subcategoria(subcategoria: Subcategoria) {
    this._spinner.show();
    this._subcategoriaService.eliminar_subcategoria(subcategoria.id)
    .subscribe(resp => {
      this.listar_subcategoria();
      this._spinner.hide();
      this._shared.alert_success('Subcategoría eliminada');
    });
  }

  habilitar_edicion(subcategoria: Subcategoria) {
    console.log(subcategoria);
    this.editar = true;
    this.setear_formulario(subcategoria.id, subcategoria.id_categoria, subcategoria.nombre_sub_categoria);    
  }

  habilitar_nuevo_registro() {
    this.editar = false;
    this.formulario.reset({id_categoria: 0});  
  }

  obtener_datos_formulario() {
    this.subcategoria = new Subcategoria();
    this.subcategoria.id = this.formulario.get('id').value || 0;
    this.subcategoria.id_categoria = Number(this.formulario.get('id_categoria').value);
    this.subcategoria.nombre_sub_categoria = this.formulario.get('nombre_subcategoria').value;
  }

  pasar_validacion(): boolean {
    if(this.formulario.invalid){
      this._shared.alert_error('Llene correctamente el formulario');
      return false;
    }
    return true;
  }

  crearFormulario(){
    this.formulario = new FormGroup({
        id: new FormControl(null),
        id_categoria: new FormControl(0, [Validators.required]),
        nombre_subcategoria: new FormControl(null, [Validators.required])
    });
  }

  setear_formulario(id: number, id_cate: number, nom: string) {
    this.formulario.setValue({
      id: id,
      id_categoria: id_cate,
      nombre_subcategoria: nom
    })
  }

}
