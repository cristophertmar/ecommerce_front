import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/services/shared.service';
import { Marca } from '../../models/marca.model';
import { MarcaService } from '../../services/marca.service';
import { ArchivoService } from '../../services/archivo.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styles: [
  ]
})
export class MarcaComponent implements OnInit {

  formulario: FormGroup;

  pagina_actual: number = 1;
  marca: Marca;
  marcas: Marca[];

  editar: boolean;

  imagenSubir: File;
  imagenes: FileList;
  imagenTemp: string;
  @ViewChild('btn_selecimg') btn_selecimg: ElementRef<HTMLElement>;

  constructor(
    private _marcaService: MarcaService,
    private _archivoService: ArchivoService,
    private _shared: SharedService,
    private _spinner: NgxSpinnerService
  ) {
    this.crearFormulario();
    this.marcas = [];
    this.editar = false;
  }

  ngOnInit(): void {
    this.listar_marca();
  }

  listar_marca() {
    this._marcaService.listar_marca()
    .subscribe((resp: any) => {
      this.marcas = resp.data;
    });
  }

  guardar_marca() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      this._spinner.show();
      this._marcaService.insertar_marca(this.marca)
      .subscribe((resp: any) => {        
          this.cambiarImagen(resp.id);
      });
    }
  }

  actualizar_marca() {
    if(this.pasar_validacion()) {
      this.obtener_datos_formulario();
      this._spinner.show();
      this._marcaService.actualizar_marca(this.marca)
      .subscribe(resp => {
        this.listar_marca();
        this.habilitar_nuevo_registro();
        this._spinner.hide();
        if(this.imagenes) {
          console.log('cambié la imagen');
          this.cambiarImagen(this.marca.id);
          return;
        }  
        
        this._shared.alert_success('Actualizado existosamente');
      });
    }    
  }

  eliminar_marca(marca: Marca) {
    this._spinner.show();
    this._marcaService.eliminar_marca(marca.id)
    .subscribe(resp => {
      this.listar_marca();
      this._spinner.hide();
      this._shared.alert_success('Marca eliminada');
    });
  }


  habilitar_edicion(marca: Marca) {
    this.editar = true;
    this.setear_formulario(marca.id, marca.nombre_marca);
    this.imagenTemp = URL_SERVICIOS +  marca.imagen;
  }

  habilitar_nuevo_registro() {
    this.editar = false;
    this.imagenTemp = null;
    this.formulario.reset({id_categoria: 0});  
  }

  obtener_datos_formulario() {
    this.marca = new Marca();
    this.marca.id = this.formulario.get('id').value || 0;
    this.marca.nombre_marca = this.formulario.get('nombre_marca').value;
  }

  pasar_validacion(): boolean {
    if(this.formulario.invalid){
      this._shared.alert_error('Llene correctamente el formulario');
      return false;
    }
    if(!this.imagenTemp) {
      this._shared.alert_error('Seleccione una imagen');
      return false;
    }
    return true;
  }

  seleccionImagen( archivos: FileList ) {

    const archivo = archivos[0];

    if (!archivo) {
      this.imagenSubir = null; return;
    }

    if ( archivo.type.indexOf('image') < 0 ) {
      this._shared.alert_error('No es una imagen');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );
    reader.onloadend = () => this.imagenTemp = reader.result.toString();

    this.imagenes = archivos;

  }

  pulsarCambio() {
    this.btn_selecimg.nativeElement.click();
  }

  cambiarImagen(id: number) {
    this._archivoService.guardar_archivo( this.imagenes, 'marca', id )
    .subscribe(resp => {
      this.listar_marca();
      this.habilitar_nuevo_registro();
      this._spinner.hide();
      this._shared.alert_success('Guardado existosamente');
    });
  }

  crearFormulario(){
    this.formulario = new FormGroup({
        id: new FormControl(null),
        nombre_marca: new FormControl(null, [Validators.required])
    });
  }

  setear_formulario(id: number, nom: string) {
    this.formulario.setValue({
      id: id,
      nombre_marca: nom
    })
  }



}
