import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Proveedor } from 'src/app/models/proveedor.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { SharedService } from 'src/app/services/shared.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Contacto } from '../../models/contacto.model';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styles: [
  ]
})
export class ProveedorComponent implements OnInit {

  @ViewChild('btn_cerrar') btn_cerrar: ElementRef<HTMLElement>;

  formulario: FormGroup;
  form_contacto: FormGroup;
  form_busqueda: FormGroup;

  pagina_actual: number = 1;

  proveedor: Proveedor = {};
  proveedores: Proveedor[] = [];

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];

  editar: boolean;

  contactos: Contacto[] = [];
  edicion_contacto: boolean = false;
  indice_editar: number = 0;
  

  constructor(
    private _proveedorService: ProveedorService,
    private _ubigeoService: UbigeoService,
    private _shared: SharedService,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listar_proveedor();
    this.listar_departamento();
    this.departamento_listener();
    this.provincia_listener(); 
    this.editar = false;
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

  listar_proveedor() {
    const patron_busqueda = this.form_busqueda.get('patron_busqueda').value ? this.form_busqueda.get('patron_busqueda').value : '';
    this._proveedorService.listar_proveedor(patron_busqueda)
    .subscribe( (resp: any) => {
      this.proveedores = resp.data;
    });
  }

  habilitar_nuevo_registro() {
    this.editar = false;
    this.formulario.reset({departamento: 0, provincia: 0, distrito: 0});  
    this.contactos = [];
  }

  habilitar_edicion(proveedor: Proveedor) {
    this.editar = true;
    this.setear_formulario(proveedor);
  }

  setear_formulario(proveedor: Proveedor) {
    const ubigeo: Ubigeo = JSON.parse(proveedor.ubigeo);
    /* console.log(proveedor); */
    this.formulario.setValue({
      id: proveedor.id,
      ruc: proveedor.ruc,
      razon_social: proveedor.razon_social,
      departamento: ubigeo.departamento,
      provincia: ubigeo.provincia,
      distrito: proveedor.ubigeo,
      direccion: proveedor.direccion,
      celular: proveedor.celular,
      telefono: proveedor.fono,
      pagina_web: proveedor.pagina_web
    });

    this.contactos = JSON.parse(proveedor.contacto);
  }

  guardar_proveedor() {    
    this.obtener_datos_formulario();
    this._proveedorService.insertar_proveedor(this.proveedor)
    .subscribe(resp => {
        this._shared.alert_success('Agregado exitosamente');
        this.habilitar_nuevo_registro();
        this.listar_proveedor();
    });
  }

  actualizar_proveedor() {
    this.obtener_datos_formulario();
    this._proveedorService.actualizar_proveedor(this.proveedor)
    .subscribe(resp => {
      this._shared.alert_success('Actualizado exitosamente');
      this.habilitar_nuevo_registro();
      this.listar_proveedor();
    });
  }

  eliminar_proveedor(proveedor) {
    this._proveedorService.eliminar_proveedor(proveedor.id)
    .subscribe(resp => {    
      this._shared.alert_success('Proveedor eliminado');
      this.listar_proveedor();
    })
  }

  obtener_datos_formulario() {
    this.proveedor.ruc = (this.formulario.get('ruc').value) + '';
    this.proveedor.razon_social = this.formulario.get('razon_social').value;
    this.proveedor.direccion = this.formulario.get('direccion').value;
    this.proveedor.ubigeo = this.formulario.get('distrito').value;
    this.proveedor.celular = (this.formulario.get('celular').value) + '';
    this.proveedor.fono = (this.formulario.get('telefono').value) + '';
    this.proveedor.pagina_web = this.formulario.get('pagina_web').value;
    this.proveedor.contacto = JSON.stringify(this.contactos);
  }

  agregar_contacto() {
    const contacto = new Contacto(
      this.form_contacto.get('nombre').value,
      this.form_contacto.get('cargo').value,
      this.form_contacto.get('celular').value,
      this.form_contacto.get('correo').value
    );
    this.contactos.push(contacto);
    this.btn_cerrar.nativeElement.click();
  }

  editar_contacto(i: number) {    
    this.edicion_contacto = true;
    this.indice_editar = i;
    this.form_contacto.setValue ({
      nombre: this.contactos[i].nombre,
      cargo: this.contactos[i].cargo,
      celular: this.contactos[i].celular,
      correo: this.contactos[i].correo
    });
    this.btn_cerrar.nativeElement.click();

  }

  eliminar_contacto(i: number) {
    this.contactos.splice(i, 1);
  }

  actualizar_contacto() {
    const i = this.indice_editar;
    const contacto = new Contacto(
      this.form_contacto.get('nombre').value,
      this.form_contacto.get('cargo').value,
      this.form_contacto.get('celular').value,
      this.form_contacto.get('correo').value
    );
    this.contactos[i] = contacto;
    this.edicion_contacto = false;
    this.btn_cerrar.nativeElement.click();
  }

  reset_form_contacto() {
    this.edicion_contacto = false;
    this.form_contacto.reset(
      {
        nombre: null,
        cargo: null,
        celular: null,
        correo: null
      }
    );
  }

  crearFormulario(){
    this.formulario = new FormGroup({
        id: new FormControl(null),
        ruc: new FormControl(null, [Validators.required, Validators.pattern('^(?!0).*$')]),
        razon_social: new FormControl(null, [Validators.required, Validators.pattern('^(?!0).*$')]),
        departamento: new FormControl(0, [Validators.required]),
        provincia: new FormControl(0, [Validators.required]),
        distrito: new FormControl(0, [Validators.required]),
        direccion: new FormControl(null, [Validators.required]),
        celular: new FormControl(null, [Validators.required]),
        telefono: new FormControl(null, [Validators.required]),
        pagina_web: new FormControl(null, [Validators.required])
    });
    this.form_contacto = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      cargo: new FormControl('', [Validators.required]),
      celular: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required])
    });
    this.form_busqueda = new FormGroup({
      patron_busqueda: new FormControl('')
    });
  }

  limpiar() {
    this.form_busqueda.reset();
    this.listar_proveedor();
  }


}
