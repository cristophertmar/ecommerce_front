import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Proveedor } from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(private _http: HttpClient) { }

  listar_proveedor(patron_busqueda: string = '') {
    const url = URL_SERVICIOS + 'api/proveedor/listar?patron_busqueda=' + patron_busqueda;
    return this._http.get(url);
  }

  insertar_proveedor(proveedor: Proveedor) {
    const url = URL_SERVICIOS + 'api/proveedor/guardar';
    return this._http.post(url, proveedor);
  }

  actualizar_proveedor(proveedor: Proveedor) {
    const url = URL_SERVICIOS + 'api/proveedor/actualizar';
    return this._http.put(url, proveedor);
  }

  eliminar_proveedor(id: number) {
    const url = URL_SERVICIOS + 'api/proveedor/eliminar?id=' + id;
    return this._http.delete(url);
  }


}
