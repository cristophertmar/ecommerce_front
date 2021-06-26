import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  constructor(
    private _http: HttpClient
  ) { }

  listar_departamentos() {
    const url = URL_SERVICIOS + 'api/ubigeo/departamento_listar';
    return this._http.get(url);
  }

  listar_provincia(departamento: string) {
    const url = URL_SERVICIOS + 'api/ubigeo/provincia_listar?departamento=' + departamento;
    return this._http.get(url);
  }

  listar_distrito(departamento: string, provincia: string) {
    const url = URL_SERVICIOS + 'api/ubigeo/distrito_listar?departamento=' + departamento + '&provincia=' + provincia;
    return this._http.get(url);
  }



}
