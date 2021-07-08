export class FiltroTienda {

    constructor(
        public id_promocion?: number,
        public cantxpagina?: number,
        public orden_lista?: number,
        public id_categoria?: number,
        public id_sub_categoria?: number,
        public nombre_tipo?: string,
        public precio_min?: number,
        public precio_max?: number,
        public pagina?: number        
    ) {}

}