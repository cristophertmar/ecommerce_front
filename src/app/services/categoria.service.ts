import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(
    public _http: HttpClient
  ) { }

  listar_categoria(patron_busqueda = '') {
    const url = URL_SERVICIOS + 'api/categoria/listar?patron_busqueda=' + patron_busqueda;
    return this._http.get(url);
  }

  listar_categoria_detallado() {
    const url = URL_SERVICIOS + 'api/categoria/listar_detallado';
    return this._http.get(url);
  }

  insertar_categoria(categoria: Categoria) {
    const url = URL_SERVICIOS + 'api/categoria/guardar';
    return this._http.post(url, categoria);
  }

  actualizar_categoria(categoria: Categoria) {
    const url = URL_SERVICIOS + 'api/categoria/actualizar';
    return this._http.put(url, categoria);
  }

  eliminar_categoria(id: number) {
    const url = URL_SERVICIOS + 'api/categoria/eliminar?id=' + id;
    return this._http.delete(url);
  }

  verificar_categoria(id_categoria: number) {
    const url = URL_SERVICIOS + 'api/categoria/verificar?id_categoria=' + id_categoria;
    return this._http.get(url);
  }

}
