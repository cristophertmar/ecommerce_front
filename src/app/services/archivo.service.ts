import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  constructor(
    private _http: HttpClient
  ) { }

  guardar_archivo(archivos: FileList, repositorio: string, id: any) {
    const url = URL_SERVICIOS + 'api/archivo/' + repositorio + '/' + id;
    const formData: FormData = new FormData();
    if (archivos.length > 0) {
      for ( const i in archivos ) {
        formData.append('files', archivos[i]);
      }
    }
    return this._http.post(url, formData, { reportProgress: true });
  }


}
