import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { SharedService } from '../../services/shared.service';
import { UbigeoService } from '../../services/ubigeo.service';
import { Ubigeo } from 'src/app/models/ubigeo.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  fdetalle_per: FormGroup;
  fcambio_pass: FormGroup;
  fcambio_ubigeo: FormGroup;

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];

  usuario: Usuario;

  constructor(
    private _usuarioService: UsuarioService,
    private _ubigeoService: UbigeoService,
    private _shared: SharedService
  ) {
    this.usuario = _usuarioService.usuario;
  }

  ngOnInit(): void {    
    this.crear_form(); 
    this.listar_departamento();
    this.departamento_listener();
    this.provincia_listener(); 
    this.setear_formulario_ubigeo();
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
      this.listar_distrito(departamento, this.fcambio_ubigeo.value.provincia);
  });
  }

  listar_distrito(departamento: string, provincia) {
    this._ubigeoService.listar_distrito(departamento, provincia)
    .subscribe((resp: any) => {
      this.distritos = resp.data;
  });
  }

  departamento_listener() {
    this.fcambio_ubigeo.get('departamento').valueChanges.subscribe((departamento: string) => {
      this.listar_provincia(departamento);
    });
  }

  provincia_listener() {
    this.fcambio_ubigeo.get('provincia').valueChanges.subscribe((provincia: string) => {
      const departamento = this.fcambio_ubigeo.value.departamento;
      this.listar_distrito(departamento, provincia);
    });
  }

  setear_formulario_ubigeo() {
    this.fcambio_ubigeo.setValue ({
      departamento: this.usuario.ubigeo ? this.usuario.ubigeo.departamento : 0,
      provincia: this.usuario.ubigeo ?  this.usuario.ubigeo.provincia : 0,
      distrito: this.usuario.ubigeo ? this.usuario.ubigeo.codigo : 0,
      direccion: this.usuario.direccion,
      numero: this.usuario.numero,
      piso: this.usuario.piso,
      referencia: this.usuario.referencia
    });
  }

  sonIguales( campo1: string, campo2: string ) {
    return ( group: FormGroup ) => {
      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;
      if ( pass1 === pass2 ) {
        return null;
      }
      return { sonIguales: true };
    };
  }

  guardar_ipersonal() {    
    
    if ( this.fdetalle_per.invalid ) {
      this._shared.alert_error('Debe llenar correctamente el fomulario');
      return Object.values( this.fdetalle_per.controls).forEach( control => {
        control.markAsTouched();
      });
    }

      this.usuario.ruc = this.fdetalle_per.value.ruc;
      this.usuario.nombre = this.fdetalle_per.value.nombre;
      this.usuario.correo = this.fdetalle_per.value.correo;
      this.usuario.telefono1 = this.fdetalle_per.value.telefono1;
      this.usuario.telefono2 = this.fdetalle_per.value.telefono2;
      this.usuario.telefono3 = this.fdetalle_per.value.telefono3;

      this._usuarioService.actualizar_usuario(this.usuario)
      .subscribe(resp => {
        this._shared.alert_success('Actualizado satisfactoriamente');
      });

  }

  guardar_cambio_pass() {
    if ( this.fcambio_pass.invalid ) {
      this._shared.alert_error('Debe llenar correctamente el fomulario');
      return Object.values( this.fcambio_pass.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this.usuario.contrasena = this.fcambio_pass.value.password;
    this._usuarioService.actualizar_usuario(this.usuario)
    .subscribe(resp => {
      this.fcambio_pass.reset();
      this._shared.alert_success('Actualizado satisfactoriamente');
    });
  }

  guardar_ubigeo() {

    if ( this.fcambio_ubigeo.invalid ) {
      this._shared.alert_error('Debe llenar correctamente el fomulario');
      return Object.values( this.fcambio_ubigeo.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this.usuario.cod_ubigeo = this.fcambio_ubigeo.value.distrito;
    this.usuario.direccion = this.fcambio_ubigeo.value.direccion;
    this.usuario.numero = this.fcambio_ubigeo.value.numero;
    this.usuario.piso = this.fcambio_ubigeo.value.piso;
    this.usuario.referencia = this.fcambio_ubigeo.value.referencia;

    let ubigeo = new Ubigeo();
    ubigeo.codigo =  this.fcambio_ubigeo.value.distrito;
    ubigeo.departamento =  this.fcambio_ubigeo.value.departamento;
    ubigeo.provincia =  this.fcambio_ubigeo.value.provincia;
    ubigeo.distrito =  this.obtener_distrito(this.fcambio_ubigeo.value.distrito);

    this.usuario.ubigeo = ubigeo;


    this._usuarioService.actualizar_usuario(this.usuario)
    .subscribe(resp => {
      this._shared.alert_success('Actualizado satisfactoriamente');
    });


  }

  obtener_distrito(codigo) {
      const newArray = this.distritos.filter( distrito => {
          return distrito.codigo === codigo;
      });    
      return newArray[0].distrito;
  }

  crear_form() {
    this.fdetalle_per = new FormGroup({
      ruc: new FormControl(this.usuario.ruc, [Validators.required, Validators.minLength(10)]),
      nombre: new FormControl(this.usuario.nombre, [Validators.required, Validators.minLength(3)]),
      correo: new FormControl(this.usuario.correo, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      telefono1: new FormControl(this.usuario.telefono1, [Validators.required, Validators.minLength(9)]),
      telefono2: new FormControl(this.usuario.telefono2, [Validators.required, Validators.minLength(7)]),
      telefono3: new FormControl(this.usuario.telefono3)
    });

    this.fcambio_pass = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      password2: new FormControl(null, [Validators.required, Validators.minLength(6)])
    }, { validators: this.sonIguales('password', 'password2')});

    this.fcambio_ubigeo = new FormGroup({
      departamento: new FormControl('0', [Validators.required, Validators.pattern('^(?!0).*$')]),
      provincia: new FormControl('0', [Validators.required, Validators.pattern('^(?!0).*$')]),
      distrito: new FormControl('0', [Validators.required, Validators.minLength(6)]),      
      direccion: new FormControl(this.usuario.direccion, [Validators.required, Validators.minLength(3)]),
      numero: new FormControl(this.usuario.numero, [Validators.required]),
      piso: new FormControl(this.usuario.piso, [Validators.required]),
      referencia: new FormControl(this.usuario.referencia, [Validators.required])
    });

  }


  get rucNoValido() {
    return this.fdetalle_per.get('ruc').invalid && this.fdetalle_per.get('ruc').touched;
  }

  get nombreNoValido() {
    return this.fdetalle_per.get('nombre').invalid && this.fdetalle_per.get('nombre').touched;
  }

  get correoNoValido() {
    return this.fdetalle_per.get('correo').invalid && this.fdetalle_per.get('correo').touched;
  }

  get telefono1NoValido() {
    return this.fdetalle_per.get('telefono1').invalid && this.fdetalle_per.get('telefono1').touched;
  }

  get telefono2NoValido() {
    return this.fdetalle_per.get('telefono2').invalid && this.fdetalle_per.get('telefono2').touched;
  }

  get telefono3NoValido() {
    return this.fdetalle_per.get('telefono3').invalid && this.fdetalle_per.get('telefono3').touched;
  }

  
  get pass1NoValido() {
    return this.fcambio_pass.get('password').invalid && this.fcambio_pass.get('password').touched;
  }

  get pass2NoValido() {
    return this.fcambio_pass.get('password2').invalid && this.fcambio_pass.get('password2').touched;
  }


  get departamentoNoValido() {
    return this.fcambio_ubigeo.get('departamento').invalid && this.fcambio_ubigeo.get('departamento').touched;
  }

  get provinciaNoValido() {
    return this.fcambio_ubigeo.get('provincia').invalid && this.fcambio_ubigeo.get('provincia').touched;
  }

  get distritoNoValido() {
    return this.fcambio_ubigeo.get('distrito').invalid && this.fcambio_ubigeo.get('distrito').touched;
  }

  get direccionNoValido() {
    return this.fcambio_ubigeo.get('direccion').invalid && this.fcambio_ubigeo.get('direccion').touched;
  }

  get numeroNoValido() {
    return this.fcambio_ubigeo.get('numero').invalid && this.fcambio_ubigeo.get('numero').touched;
  }

  get pisoNoValido() {
    return this.fcambio_ubigeo.get('piso').invalid && this.fcambio_ubigeo.get('piso').touched;
  }

  


}
