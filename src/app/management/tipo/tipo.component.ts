import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Categoria } from 'src/app/models/categoria.model';
import { Subcategoria } from 'src/app/models/subcategoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SharedService } from 'src/app/services/shared.service';
import { SubCategoriaService } from '../../services/sub-categoria.service';
import { Tipo } from '../../models/tipo.model';
import { TipoService } from '../../services/tipo.service';

@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
  styles: [
  ]
})
export class TipoComponent implements OnInit {

  formulario: FormGroup;

  pagina_actual: number = 1;  
  
  categorias: Categoria[];
  subcategorias: Subcategoria[];

  tipo: Tipo;
  tipos: Tipo[];

  editar: boolean;

  constructor(
    private _categoriaService: CategoriaService,
    private _subcategoriaService: SubCategoriaService,
    private _tipoService: TipoService,
    private _shared: SharedService,
    private _spinner: NgxSpinnerService
  ) {
    this.crearFormulario();
    this.categorias = [];
    this.subcategorias = [];
    this.tipos = [];
    this.editar = false;
  }

  ngOnInit(): void {
    this.listar_tipo();
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

  listar_tipo() {
    this._tipoService.listar_tipo()
    .subscribe((resp: any) => {
      this.tipos = resp.data;
    });
  }

  guardar_tipo() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      this._spinner.show();
      this._tipoService.insertar_tipo(this.tipo)
      .subscribe(resp => {
          this.listar_tipo();
          this.habilitar_nuevo_registro();
          this._spinner.hide();
          this._shared.alert_success('Agregado existosamente');
      });
    }
  }

  actualizar_tipo() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      this._spinner.show();
      this._tipoService.actualizar_tipo(this.tipo)
      .subscribe(resp => {
        this.listar_tipo();
        this.habilitar_nuevo_registro();
        this._spinner.hide();
        this._shared.alert_success('Actualizado existosamente');
      });
    }    
  }

  eliminar_tipo(tipo: Tipo) {
    this._spinner.show();
    this._tipoService.eliminar_tipo(tipo.id)
    .subscribe(resp => {
      this.listar_tipo();
      this._spinner.hide();
      this._shared.alert_success('Tipo eliminado');
    });
  }

  habilitar_edicion(tipo: Tipo) {
    this.editar = true;
    this.setear_formulario(tipo.id, tipo.id_categoria, tipo.id_subcategoria, tipo.nombre_tipo);    
  }

  habilitar_nuevo_registro() {
    this.editar = false;
    this.formulario.reset({id_categoria: 0, id_subcategoria: 0});  
  }

  obtener_datos_formulario() {
    this.tipo = new Tipo();
    this.tipo.id = this.formulario.get('id').value || 0;
    this.tipo.id_categoria = Number(this.formulario.get('id_categoria').value);
    this.tipo.id_subcategoria = Number(this.formulario.get('id_subcategoria').value);
    this.tipo.nombre_tipo = this.formulario.get('nombre_tipo').value;
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
        id_subcategoria: new FormControl(0, [Validators.required]),
        nombre_tipo: new FormControl(null, [Validators.required])
    });
  }

  setear_formulario(id: number, id_cate: number, id_subcate: number, nom: string) {
    this.formulario.setValue({
      id: id,
      id_categoria: id_cate,
      id_subcategoria: id_subcate,
      nombre_tipo: nom
    })
  }

}
