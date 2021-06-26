import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { Tipo } from '../models/tipo.model';

@Injectable({
  providedIn: 'root'
})
export class TipoService {

  constructor(
    public _http: HttpClient
  ) { }


  listar_tipo(id_subcategoria: number = 0) {
    const url = URL_SERVICIOS + 'api/tipo/listar?id_subcategoria='+ id_subcategoria;
    return this._http.get(url);
  }

  insertar_tipo(tipo: Tipo) {
    const url = URL_SERVICIOS + 'api/tipo/guardar';
    return this._http.post(url, tipo);
  }

  actualizar_tipo(tipo: Tipo) {
    const url = URL_SERVICIOS + 'api/tipo/actualizar';
    return this._http.put(url, tipo);
  }

  eliminar_tipo(id: number) {
    const url = URL_SERVICIOS + 'api/tipo/eliminar?id=' + id;
    return this._http.delete(url);
  }



}
