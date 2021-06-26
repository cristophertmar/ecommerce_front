export class OrdenDetalle {

    constructor(
        public orden_id?: string,
        public producto_id?: string,
        public precio_unitario?: number,
        public cantidad_compra?: number,
        public subtotal?: number,
        public cantidad_aprobada?: number,
        public subtotal_aprobado?: number,

    ) {}

}