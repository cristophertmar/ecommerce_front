import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/models/proveedor.model';
import * as XLSX from 'xlsx';
import { ExcelPrecio } from '../../models/excel_precio.model';
import { ProductoService } from '../../services/producto.service';
import { ProveedorService } from '../../services/proveedor.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-producto-precio',
  templateUrl: './producto-precio.component.html',
  styles: [
  ]
})
export class ProductoPrecioComponent implements OnInit {

  /* convertedJson!: string; */
  data: ExcelPrecio[] = [];
  id_proveedor: number = 0;
  proveedor: Proveedor = {};
  no_actualizados: ExcelPrecio[] = [];
  valido: boolean = false;

  constructor(
    private _productoService: ProductoService,
    private _proveedorService: ProveedorService,
    private _shared: SharedService
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
        const data: any = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        /* console.log(data); */
        if(data[0].RUC) {
          this.proveedor.ruc = data[0].RUC;
          console.log( this.proveedor);
          this.obtener_proveedor(data[0].RUC);
        }
        /* this.convertedJson = JSON.stringify(data, undefined, 4); */        
        this.data = data;
      });
    }
  }

  obtener_proveedor(ruc: string) {

    this._proveedorService.verificar_proveedor(ruc)
    .subscribe((resp: any) => {

        this.valido = resp.resp.exito
        const id_proveedor = resp.resp.id_proveedor;
        if(!this.valido) {
          this._shared.alert_error(resp.resp.mensaje);         
        }
        this.id_proveedor = id_proveedor;
    });

  }

  cargar_precios() {
    this._productoService.actualizar_producto_precio(this.data, this.id_proveedor)
    .subscribe((resp: any) => {
        this.no_actualizados = resp.no_actualizados;
        /* console.log(resp.no_actualizados); */
    });
  }

}
