import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { Subcategoria } from '../models/subcategoria.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriaService {

  constructor(
    public _http: HttpClient
  ) { }

  listar_subcategoria(id_categoria: number = 0) {
    const url = URL_SERVICIOS + 'api/subcategoria/listar?id_categoria=' + id_categoria;
    return this._http.get(url);
  }

  insertar_subcategoria(subcategoria: Subcategoria) {
    const url = URL_SERVICIOS + 'api/subcategoria/guardar';
    return this._http.post(url, subcategoria);
  }

  actualizar_subcategoria(subcategoria: Subcategoria) {
    const url = URL_SERVICIOS + 'api/subcategoria/actualizar';
    return this._http.put(url, subcategoria);
  }

  eliminar_subcategoria(id: number) {
    const url = URL_SERVICIOS + 'api/subcategoria/eliminar?id=' + id;
    return this._http.delete(url);
  }


}
