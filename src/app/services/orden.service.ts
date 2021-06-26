import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { Orden } from '../models/orden.model';
import { HttpClient } from '@angular/common/http';
import { OrdenCambio } from '../models/orden_cambio.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  constructor(
    private _http: HttpClient
  ) { }

  generar_orden(orden: Orden, estado: number = 1, correo: string) {
    const url = URL_SERVICIOS + 'api/orden/generar?estado=' + estado + '&correo=' + correo;
    return this._http.post(url, orden);
  }

  listar_orden(orden_filtro: any) {
    const url = URL_SERVICIOS + 'api/orden/listar';
    return this._http.post(url, orden_filtro);
  }

  obtener_orden(id: string) {
    const url = URL_SERVICIOS + 'api/orden/orden_obtener?id=' + id;
    return this._http.get(url);
  }

  cambiar_estado_orden(orden: OrdenCambio, correo: string) {
    const url = URL_SERVICIOS + 'api/orden/cambiar_estado?correo=' + correo;
    return this._http.put(url, orden);
  }
  
}
