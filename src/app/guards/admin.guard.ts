import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private _usuarioService: UsuarioService
  ){}

  canActivate() {
    
    if(this._usuarioService.acceso_admin()) {
      return true;
    }   
    return false;
    
  }
  
}
