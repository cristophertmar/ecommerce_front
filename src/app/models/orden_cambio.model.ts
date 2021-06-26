import { OrdenDetalle } from "./orden_detalle.model";

export class OrdenCambio {
    constructor(
        public id?: string,
        public estado?: number,
        public detalles?: OrdenDetalle[]
    ) {}

}