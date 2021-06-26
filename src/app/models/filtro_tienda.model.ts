export class FiltroTienda {

    constructor(
        public id_categoria?: number,
        public id_sub_categoria?: number,
        public nombre_tipo?: string,
        public precio_min?: number,
        public precio_max?: number,
        public orden_lista?: number,
        public pagina?: number,
        public cantxpagina?: number
    ) {}

}