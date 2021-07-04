import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { Promocion } from '../models/promocion.model';

@Injectable({
  providedIn: 'root'
})
export class PromocionService {

  constructor(
    public _http: HttpClient
  ) { }


  listar_promocion(patron_busqueda: string = '') {
    const url = URL_SERVICIOS + 'api/promocion/listar?patron_busqueda=' + patron_busqueda;
    return this._http.get(url);
  }

  insertar_promocion(promocion: Promocion) {
    const url = URL_SERVICIOS + 'api/promocion/guardar';
    return this._http.post(url, promocion);
  }

  actualizar_promocion(promocion: Promocion) {
    const url = URL_SERVICIOS + 'api/promocion/actualizar';
    return this._http.put(url, promocion);
  }

  eliminar_promocion(id: number) {
    const url = URL_SERVICIOS + 'api/promocion/eliminar?id=' + id;
    return this._http.delete(url);
  }

}