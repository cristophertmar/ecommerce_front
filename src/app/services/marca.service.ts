import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { Marca } from '../models/marca.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  constructor(
    private _http: HttpClient
  ) { }

  listar_marca(patron_busqueda: string = '') {
    const url = URL_SERVICIOS + 'api/marca/listar?patron_busqueda=' + patron_busqueda;
    return this._http.get(url);
  }

  insertar_marca(marca: Marca) {
    const url = URL_SERVICIOS + 'api/marca/guardar';
    return this._http.post(url, marca);
  }

  actualizar_marca(marca: Marca) {
    const url = URL_SERVICIOS + 'api/marca/actualizar';
    return this._http.put(url, marca);
  }

  eliminar_marca(id: number) {
    const url = URL_SERVICIOS + 'api/marca/eliminar?id=' + id;
    return this._http.delete(url);
  }



}
