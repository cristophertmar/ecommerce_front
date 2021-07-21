import { Ubigeo } from './ubigeo.model';
import { Contacto } from './contacto.model';

export class Proveedor {

    constructor(
        public id?: number,
        public ruc?: string,
        public razon_social?: string,
        public direccion?: string,
        public ubigeo?: string,
        public ubigeo_objeto?: Ubigeo,
        public celular?: string,
        public fono?: string,
        public pagina_web?: string,
        public contacto?: string,
        public contacto_array?: Contacto[],
        public estado?: boolean
    ) {}

}