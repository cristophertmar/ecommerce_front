import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '../config/config';
import { Usuario } from '../models/usuario.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _shared: SharedService
  ) { 
    this.cargarStorage();
  }

  esta_logueado() {
    return this.token.length > 0? true : false;
  }

  acceso_admin() {    
    
    let acceso: boolean =  false;

    switch (this.usuario.rol) {
      case 'ADMIN_ROL': 
        acceso = true;
        break;
      default:
        acceso = false;
        break;
    }

    return acceso;

  }

  limpiarAcceso() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.token = '';
    this.usuario = null;
  }

  cargarStorage() {
    if ( localStorage.getItem('token'))  {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.limpiarAcceso();
    }
  }

  guardarStorage( token: string, usuario: Usuario ) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;

    /* console.log('guradar', usuario);
    console.log('local', this.usuario); */
  }

  logout_usuario() {
    this.limpiarAcceso();
    this._router.navigate(['/inicia-ahora']);
  }

  registro_usuario(usuario: Usuario) {
    const url = URL_SERVICIOS + 'api/account/registro';
    return this._http.post(url, usuario)
    .pipe(
      map((resp: any) => {
        // console.log(resp);
        // this.guardarStorage( resp.token, resp.usuario );
        return resp;
      }),
      catchError(err => {
        this._shared.alert_error('El correo ingresado no es válido');
        return throwError(err);
      })
    );
  }

  login_usuario(usuario: Usuario, recordar: boolean, ruta: string = '/mi-perfil') {
    
    if (recordar) {
      localStorage.setItem('correo_remember', usuario.correo );
      localStorage.setItem('contrasena_remember', usuario.contrasena );
    } else {
      localStorage.removeItem('correo_remember');
      localStorage.removeItem('contrasena_remember');
    }

    const url = URL_SERVICIOS + 'api/account/login';

    return this._http.post( url, usuario ).pipe(
      map( (resp: any) => {

        if(resp.usuario.estado !== 2) {
          this._shared.alert_error('Su usuario aún no ha sido aprobado');
          return;
        }

        this.guardarStorage( resp.token, resp.usuario );
        this._router.navigate([ruta]);
        this._shared.alert_toast_success('Bienvenido ' + resp.usuario.nombre);
        return true;

      }),
      catchError(err => {
        this._shared.alert_error('Correo o contraseña incorrecta');
        return throwError(err);
      }));
  }

  listar_aprobar_usuario(estado: number = 1, patron_busqueda: string = '') {
    const url = URL_SERVICIOS + 'api/usuario/aprobar_listar?estado=' + estado + '&patron_busqueda=' + patron_busqueda;
    return this._http.get(url);
  }

  actualizar_usuario(usuario: Usuario) {

    const url = URL_SERVICIOS + 'api/usuario/actualizar';
    return this._http.put(url, usuario).pipe(
    map( (resp: any) => {
      this.guardarStorage(this.token, usuario);
      return true;
    }),
    catchError(err => {
      console.error('Ocurrió un error al actualizar datos');
      return throwError(err);
    }));

  }

  actualizar_aprobar_usuario(usuario: Usuario) {

    const url = URL_SERVICIOS + 'api/usuario/aprobar_actualizar';
    return this._http.put(url, usuario);

  }

  

}
