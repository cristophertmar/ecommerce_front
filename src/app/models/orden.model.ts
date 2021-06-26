import { OrdenDetalle } from './orden_detalle.model';
import { UsuarioEntrega } from './usuario_entrega.model';
import { DireccionEntrega } from './direccion_entrega.model';

export class Orden {
    constructor(
        public id?: string,
        public id_usuario?: number,
        public monto?: number,
        public usuario_entrega?: string,
        public direccion_entrega?: string,
        public detalles?: OrdenDetalle[],
        public usuario_entrega_obj?: UsuarioEntrega,
        public direccion_entrega_obj?: DireccionEntrega,
        public estado?: string
    ) {}

}