import { Galeria } from './galeria.model';
export class Producto {

    constructor(
        public codigo_fabricante?: string,
        public id?: string,
        public sku?: string,
        public id_categoria?: number,
        public id_sub_categoria?: number,
        public id_tipo?: number,
        public id_marca?: number,
        public nombre_producto?: string,
        public descripcion_producto?: string,
        public precio_original?: number,
        public precio?: number,
        public descuento?: number,
        public stock?: number,
        public id_promocion?: number,
        public visitas?: number,
        public fecha_crea?: string,
        public estado?: boolean,
        public producto_asociado?: string,
        public galeria?: Galeria[],
        public imagen_1?: string,
        public imagen_2?: string,
        public cantidad_comprar?: number,
        public monto?: number,
        public id_unidad_medida?: number,
        public unidad_medida?: string,
        public control_stock?: boolean
    ) {}    

}