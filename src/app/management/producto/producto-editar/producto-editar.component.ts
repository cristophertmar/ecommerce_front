import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/categoria.model';
import { Subcategoria } from 'src/app/models/subcategoria.model';
import { Marca } from '../../../models/marca.model';
import { CategoriaService } from '../../../services/categoria.service';
import { SubCategoriaService } from '../../../services/sub-categoria.service';
import { MarcaService } from '../../../services/marca.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ArchivoService } from '../../../services/archivo.service';
import { TipoService } from '../../../services/tipo.service';
import { Tipo } from '../../../models/tipo.model';
import { Promocion } from '../../../models/promocion.model';
import { PromocionService } from '../../../services/promocion.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Galeria } from '../../../models/galeria.model';

@Component({
  selector: 'app-producto-editar',
  templateUrl: './producto-editar.component.html',
  styles: [
  ]
})
export class ProductoEditarComponent implements OnInit {

  formulario: FormGroup;

  editar: boolean;

  imagenSubir: File;
  imagenes: FileList;
  imagen_temporal: string;
  imagenes_temporal: string[] = [];
  @ViewChild('btn_selecimg') btn_selecimg: ElementRef<HTMLElement>;

  producto: Producto;
  productos: Producto[];
  productos_asocionados: Producto[];

  categorias: Categoria[];
  subcategorias: Subcategoria[];
  tipos: Tipo[];
  marcas: Marca[];
  promociones: Promocion[];

  patron_busqueda: string = '';
  galeria: Galeria[];

  estado_producto: boolean = true;

  activo: boolean;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _productoService: ProductoService,
    private _categoriaSevices: CategoriaService,
    private _subcategoriaService: SubCategoriaService,
    private _tipoService: TipoService,
    private _marcaService: MarcaService,
    private _promocionService: PromocionService,
    private _archivo: ArchivoService,
    private _shared: SharedService,
    private _spinner: NgxSpinnerService,
    private _router: Router
  ) { 
    this.crearFormulario();
    this.categorias = [];
    this.subcategorias = [];
    this.tipos = [];
    this.marcas = [];
    this.editar = false;
    this.activo = true;
    this.productos_asocionados = [];
    this.galeria = [];
  }

  ngOnInit(): void {
    this.listar_categoria();
    this.listar_promocion();
    this.listar_marca();
    this._activatedRoute.params.subscribe( ({codigo}) => {
      if(codigo !== 'nuevo') {
        this.editar = true;
        this.obtener_producto(codigo);
      } else {
        this.editar = false;
      }       
    });    
    this.categoria_listener();
    this.subcategoria_listener();
  }

  cambiar_estado_producto(estado: boolean) {
    this.estado_producto = estado;
  }

  categoria_listener() {
    this.formulario.get('id_categoria').valueChanges.subscribe((valor: number) => {
      this.listar_subcategoria(valor);
    });
  }

  subcategoria_listener() {
    this.formulario.get('id_sub_categoria').valueChanges.subscribe((valor: number) => {
    this.listar_tipo(valor);
    });
  }

  asociar_producto(producto: Producto) {
    this.productos_asocionados.push(producto);
  }

  eliminar_asociacion_producto(i: number) {
    this.productos_asocionados.splice(i, 1);
  }

  obtener_producto(id: string) {
    this._productoService.obtener_producto(id)
    .subscribe(((resp: any) => {
        this.producto = new Producto();
        this.producto = resp.data;
        this.productos_asocionados = JSON.parse(this.producto.producto_asociado);
        this.galeria = this.producto.galeria;
        this.estado_producto = this.producto.estado;
        console.log(this.producto);
        this.setearFormulario();
    }));
  }

  obtener_imagen(ruta: string) {
    return URL_SERVICIOS + ruta;
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

  listar_tipo(id_subcategoria: number) {
    this._tipoService.listar_tipo(id_subcategoria)
    .subscribe((resp: any) => {
      this.tipos = resp.data;
    });
  }

  listar_marca() {
    this._marcaService.listar_marca()
    .subscribe((resp: any) => {
      this.marcas = resp.data;
      
    });
  }

  listar_promocion() {
    this._promocionService.listar_promocion()
    .subscribe((resp: any) => {
      this.promociones = resp.data;      
    });
  }

  listar_producto() {
    const patron_busqueda = (document.getElementById("patron_busqueda") as HTMLInputElement).value || '';
    this._productoService.listar_producto(patron_busqueda)
    .subscribe((resp: any) => {
      this.productos = resp.data; 
    });
  }

  guardar_producto() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      /* this._spinner.show(); */
      console.log(this.producto);
      this._productoService.insertar_producto(this.producto)
      .subscribe((resp: any) => {        
          this. guardar_imagenes(resp.id);
      });
    }
  }

  actualizar_producto() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      this._spinner.show();
      this._productoService.actualizar_producto(this.producto)
      .subscribe((resp: any) => {       
          if(this.imagenes_temporal.length > 0) {
            this.guardar_imagenes(this.producto.id);
          } else {
            this._spinner.hide();      
            this._shared.alert_success('Actualizado exitosamente');  
            this.retornar_lista(); 
          }          
      });
    }
  }

  guardar_imagenes(id: string) {
    this._archivo.guardar_archivo(this.imagenes, 'producto', id)
    .subscribe(resp => {
      this._spinner.hide();
      this._shared.alert_success('Agregado exitosamente');
      this.retornar_lista();
    });
  }

  obtener_datos_formulario() {
    this.producto = new Producto();

    this.producto.id = this.formulario.get('id').value || '';
    this.producto.codigo_fabricante = this.formulario.get('codigo_fabricante').value;
    this.producto.sku = this.formulario.get('sku').value;
    this.producto.id_categoria = Number(this.formulario.get('id_categoria').value);
    this.producto.id_sub_categoria = Number(this.formulario.get('id_sub_categoria').value);
    this.producto.id_tipo = Number(this.formulario.get('id_tipo').value);
    this.producto.id_marca = Number(this.formulario.get('id_marca').value);
    this.producto.nombre_producto = this.formulario.get('nombre_producto').value;
    this.producto.id_promocion = Number(this.formulario.get('id_promocion').value);
    this.producto.descripcion_producto = this.formulario.get('descripcion_producto').value;
    this.producto.precio = Number(this.formulario.get('precio').value);
    this.producto.stock = Number(this.formulario.get('stock').value);
    this.producto.producto_asociado = JSON.stringify(this.productos_asocionados);
    this.producto.estado = this.estado_producto;
  }

  pasar_validacion(): boolean {
    if(this.formulario.invalid){
      this._shared.alert_error('Llene correctamente el formulario');
      Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
      return false;
    }

    if((this.imagenes_temporal.length === 0) && (this.galeria.length === 0)) {
      this._shared.alert_error('Agregue imágenes a su producto');
      return false;
    }
    return true;
  }


  crearFormulario(){
    this.formulario = new FormGroup({
        id: new FormControl(null),
        codigo_fabricante: new FormControl(null, [Validators.required]),
        sku: new FormControl(null, [Validators.required]),
        id_categoria: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
        id_sub_categoria: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
        id_tipo: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
        id_marca: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
        nombre_producto: new FormControl(null, [Validators.required]),
        id_promocion: new FormControl(0, [Validators.required]),
        descripcion_producto: new FormControl(null, [Validators.required]),
        precio: new FormControl(null, [Validators.required]),
        stock: new FormControl(null, [Validators.required])
    });
  }

  get codigo_fabricanteNoValido() {
    return this.formulario.get('codigo_fabricante').invalid && this.formulario.get('codigo_fabricante').touched;
  }

  get skuNoValido() {
    return this.formulario.get('sku').invalid && this.formulario.get('sku').touched;
  }

  get id_categoriaNoValido() {
    return this.formulario.get('id_categoria').invalid && this.formulario.get('id_categoria').touched;
  }

  get id_sub_categoriaNoValido() {
    return this.formulario.get('id_sub_categoria').invalid && this.formulario.get('id_sub_categoria').touched;
  }

  get id_marcaNoValido() {
    return this.formulario.get('id_marca').invalid && this.formulario.get('id_marca').touched;
  }

  get id_tipoNoValido() {
    return this.formulario.get('id_tipo').invalid && this.formulario.get('id_tipo').touched;
  }

  get nombre_productoNoValido() {
    return this.formulario.get('nombre_producto').invalid && this.formulario.get('nombre_producto').touched;
  }

  get descripcion_productoNoValido() {
    return this.formulario.get('descripcion_producto').invalid && this.formulario.get('descripcion_producto').touched;
  }

  get precioNoValido() {
    return this.formulario.get('precio').invalid && this.formulario.get('precio').touched;
  }

  get stockNoValido() {
    return this.formulario.get('stock').invalid && this.formulario.get('stock').touched;
  }

  setearFormulario() {
    this.formulario.setValue({
      id: this.producto.id,
      codigo_fabricante: this.producto.codigo_fabricante,
      sku: this.producto.sku,
      id_categoria: this.producto.id_categoria,
      id_sub_categoria: this.producto.id_sub_categoria,
      id_tipo: this.producto.id_tipo,
      id_marca: this.producto.id_marca,
      nombre_producto: this.producto.nombre_producto,
      id_promocion: this.producto.id_promocion,
      descripcion_producto: this.producto.descripcion_producto,
      precio: this.producto.precio,
      stock: this.producto.stock
    });
  }

  seleccionImagen( archivos: FileList ) {

    if (archivos.length === 0) {
      return;
    }
    
    Array.from(archivos).forEach(archivo => {
      if (archivo.type.indexOf('image') < 0 ) {
        this._shared.alert_error('No es una imagen');
        this.imagenSubir = null;
        return;
      }

      const reader = new FileReader();
      const urlImagenTemp = reader.readAsDataURL(archivo);
      reader.onloadend = () => this.imagenes_temporal.push(reader.result.toString());

    });

    this.imagenes = archivos;

  }

  pulsarCambio() {
    this.btn_selecimg.nativeElement.click();
  }

  quitar_imagen(i: number) {
    this.imagenes_temporal.splice(i, 1);
  }

  eliminar_imagen(indice:number, id: number) {
    this.galeria.splice(indice, 1);
    this._productoService.eliminar_imagen(id)
    .subscribe(resp => {
      console.log(resp);
    });
  }

  retornar_lista() {
    this._router.navigate(['/mantenimiento/producto']);
  }

 

}
