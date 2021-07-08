import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styles: [
  ]
})
export class AccountComponent implements OnInit {

  forma_registro: FormGroup;
  forma_login: FormGroup;

  usuario_social: SocialUser;
  loggedIn: boolean;
  accedido: boolean;
  recuerdame: boolean;
  intento_login: boolean;

  correo: string;
  contrasena: string;  

  usuario: Usuario;

  constructor(
    public _usuarioService: UsuarioService,
    private _authService: SocialAuthService,
    public _router: Router,
    private _shared: SharedService,
    private _spinner: NgxSpinnerService
  ) {
    this.crearForm();
    this.accedido = false;
    this.recuerdame = false;
    this.intento_login = true;
  }

  ngOnInit(): void {

    this.correo = localStorage.getItem( 'correo_remember' ) || '';
    this.contrasena = localStorage.getItem( 'contrasena_remember' ) || '';
    this.recuerdame = this.correo.length > 1 ? true : false;
    this.setForm();

    if(this.loggedIn) {
      this.cerrar_sesion_social();
    }

    this._authService.authState.subscribe((usuario) => {
      this.usuario_social = usuario;
      this.loggedIn = (usuario != null);
      if(this.loggedIn) {
        this.redireccion();
      }      
    });
  }

  redireccion() {
    this.intento_login? this.login_usuario(false) : this.registrar_usuario_social();
  }

  login_google(intento_login: boolean) {
    this.intento_login = intento_login;
    this._authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  login_facebook(intento_login: boolean) {
    this.intento_login = intento_login;
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  cerrar_sesion_social() {
    this._authService.signOut();
  }

  refreshToken(): void {
    this._authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  crearForm() {

    this.forma_registro = new FormGroup({
      ruc: new FormControl(null, [Validators.required, Validators.minLength(11)] ),
      nombre: new FormControl(null, [Validators.required, Validators.minLength(3)] ),
      correo: new FormControl(null, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      celular: new FormControl(null, [Validators.required, Validators.minLength(9)] ),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)] ),
      password2: new FormControl(null, [Validators.required, Validators.minLength(6)] )
    }, { validators: this.sonIguales( 'password', 'password2' ) } );

    this.forma_login = new FormGroup({
      correo: new FormControl(null, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      recuerdame: new FormControl(false)
    });

  }

  setForm() {
    this.forma_login.setValue ({
      correo: this.correo,
      password: this.contrasena,
      recuerdame: this.recuerdame
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

  registrar_usuario_social() {

    if(this.accedido) {
      return;
    }

    this.accedido = true;

    const usuario = new Usuario();
    usuario.nombre = this.usuario_social.name;
    usuario.correo = this.usuario_social.email;
    usuario.proveedor = this.usuario_social.provider;

    this._usuarioService.registro_usuario(usuario)
    .subscribe( resp => {
      this._router.navigate(['/mi-perfil']);
      this.cerrar_sesion_social();
    });

  }

  login_usuario(web: boolean = true) {

    let recuerdame: boolean = false;

    if(web) {

    if ( this.forma_login.invalid ) {
      return Object.values( this.forma_login.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this.usuario = new Usuario();
    this.usuario.correo = this.forma_login.value.correo;
    this.usuario.contrasena = this.forma_login.value.password;
    this.usuario.proveedor = 'WEB'
    recuerdame = this.forma_login.value.recuerdame;

    
    } else {

    this.usuario = new Usuario();
    this.usuario.correo = this.usuario_social.email;
    this.usuario.contrasena = '';
    this.usuario.proveedor = this.usuario_social.provider;
    
    }
    
    this._spinner.show();
    this._usuarioService.login_usuario(this.usuario, recuerdame)
    .subscribe(
      resp => {
        this._spinner.hide();
      //this._router.navigate(['/mi-perfil']);
      // this.cerrar_sesion_social();
      },
      (error) => {
        this._spinner.hide();
      }
    
    );

  }

  registrar_usuario() {

    if ( this.forma_registro.invalid ) {
      return Object.values( this.forma_registro.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    /* if ( !this.forma_registro.value.condiciones ) {
      this.openDialogTerminos();
      Swal.fire({
        width: 350,
        padding: 15,
        allowOutsideClick: false,
        confirmButtonText: 'Lo haré',
        text: 'Debe de aceptar los términos y condiciones'
      });

      return;
    } */

    const usuario = new Usuario();
    usuario.ruc = this.forma_registro.value.ruc;
    usuario.nombre = this.forma_registro.value.nombre;
    usuario.correo = this.forma_registro.value.correo;
    usuario.telefono1 = this.forma_registro.value.celular;
    usuario.contrasena = this.forma_registro.value.password;

    this._spinner.show();
    this._usuarioService.registro_usuario(usuario)
    .subscribe( 
      (resp: any) => {
        this.forma_registro.reset();
        this._spinner.hide();
        this._shared.alert_info('Confirmaremos la aprobación de su registro al correo: ' + resp.usuario.correo);
      },
      (error) => {
        this._spinner.hide();
      }
    
    );
  }

   // ***Validaciones************************************** //

  get correoNoValido() {
    return this.forma_login.get('correo').invalid && this.forma_login.get('correo').touched;
  }

  get correoNoValido2() {
    return this.forma_registro.get('correo').invalid && this.forma_registro.get('correo').touched;
  }

  get pass1NoValido() {
    return this.forma_login.get('password').invalid && this.forma_login.get('password').touched;
  }

  get pass1NoValido2() {
    return this.forma_registro.get('password').invalid && this.forma_registro.get('password').touched;
  }


  get rucNoValido() {
    return this.forma_registro.get('ruc').invalid && this.forma_registro.get('ruc').touched;
  }

  get nombreNoValido() {
    return this.forma_registro.get('nombre').invalid && this.forma_registro.get('nombre').touched;
  }

  get celularNoValido() {
    return this.forma_registro.get('celular').invalid && this.forma_registro.get('celular').touched;
  }
  
  get pass2NoValido() {
    return this.forma_registro.get('password2').invalid && this.forma_registro.get('password2').touched;
  }


}
