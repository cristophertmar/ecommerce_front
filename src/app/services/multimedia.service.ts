import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Multimedia } from '../models/multimedia.model';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {

  constructor(
    private _http: HttpClient
  ) { }

  listar_multimedia(tipo: string) {
    const url = URL_SERVICIOS + 'api/producto/listar_multimedia?tipo=' + tipo;
    return this._http.get(url);
  }

  actualizar_multimedia(multimedia: Multimedia) {
    const url = URL_SERVICIOS + 'api/producto/actualizar_multimedia';
    return this._http.put(url, multimedia);
  }


}
