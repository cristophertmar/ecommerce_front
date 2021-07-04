import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/categoria.model';
import { Subcategoria } from 'src/app/models/subcategoria.model';
import { Marca } from 'src/app/models/marca.model';
import { CategoriaService } from '../../services/categoria.service';
import { SubCategoriaService } from '../../services/sub-categoria.service';
import { MarcaService } from '../../services/marca.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styles: [
  ]
})
export class ProductoComponent implements OnInit {

  pagina_actual: number = 1;
  productos: Producto[];

  form_busqueda: FormGroup;
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  marcas: Marca[];

  constructor(
    private _productoService: ProductoService,
    private _router: Router,
    private _categoriaSevices: CategoriaService,
    private _subcategoriaService: SubCategoriaService,
    private _marcaService: MarcaService
  ) { 
    this.productos = [];
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.listar_producto();

    this.listar_categoria();
    this.listar_marca();
    this.categoria_listener();
  }

  nuevo_producto() {
    this._router.navigate(['/mantenimiento/producto/nuevo']);
  }

  editar_producto(producto: Producto) {
    this._router.navigate(['/mantenimiento/producto/' + producto.id ]);
  }

  categoria_listener() {
    this.form_busqueda.get('categoria').valueChanges.subscribe((valor: number) => {
      this.listar_subcategoria(valor);
    });
  }

  listar_producto() {

    const patron_busqueda: string = this.form_busqueda.value.patron_busqueda || '';
    const id_categoria: number = this.form_busqueda.value.categoria || 0;
    const id_sub_categoria: number = this.form_busqueda.value.subcategoria || 0;
    const id_marca: number = this.form_busqueda.value.marca || 0;

    this._productoService.listar_producto(patron_busqueda, id_categoria, id_sub_categoria, id_marca)
    .subscribe((resp: any) => {
      this.productos =  resp.data;
    });
  }

  listar_categoria() {
    this._categoriaSevices.listar_categoria()
    .subscribe((resp: any) => {
      this.categorias = resp.data;
    });
  }

  listar_subcategoria(id_categoria: number) {
    this._subcategoriaService.listar_subcategoria(id_categoria)
    .subscribe((resp: any) => {
      this.subcategorias = resp.data;
    });
  }

  listar_marca() {
    this._marcaService.listar_marca()
    .subscribe((resp: any) => {
      this.marcas = resp.data;      
    });
  }

  crearFormulario(){
    this.form_busqueda = new FormGroup({
      categoria: new FormControl(0, [Validators.required]),
      subcategoria: new FormControl(0, [Validators.required]),
      marca: new FormControl(0, [Validators.required]),
      patron_busqueda: new FormControl('')
    });
  }

  limpiar() {
    this.form_busqueda.reset(
      {categoria: 0, subcategoria: 0, marca: 0, patron_busqueda: ''}
    );
    this.listar_producto();
  }


}
