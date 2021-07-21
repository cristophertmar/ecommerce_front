import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExcelPrecio } from '../../models/excel_precio.model';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-precio',
  templateUrl: './producto-precio.component.html',
  styles: [
  ]
})
export class ProductoPrecioComponent implements OnInit {

  /* convertedJson!: string; */
  data: ExcelPrecio[] = [];
  no_actualizados: ExcelPrecio[] = [];

  constructor(
    private _productoService: ProductoService
  ) { }

  ngOnInit(): void {
  }

  fileUpload(event: any) {
    /* console.log(event.target.files); */
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event: any) => {
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, {type:'binary'});
      workbook.SheetNames.forEach(sheet => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        /* this.convertedJson = JSON.stringify(data, undefined, 4); */        
        this.data = data;
      });
    }
  }

  cargar_precios() {
    this._productoService.actualizar_producto_precio(this.data)
    .subscribe((resp: any) => {
        this.no_actualizados = resp.no_actualizados;
        /* console.log(resp.no_actualizados); */
    });
  }

}
