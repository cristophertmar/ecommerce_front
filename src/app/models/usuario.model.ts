import { Ubigeo } from './ubigeo.model';
export class Usuario {

    constructor(
        public id?: number,
        public ruc?: string,
        public nombre?: string,     
        public correo?: string,
        public contrasena?: string,
        public telefono1?: string,
        public telefono2?: string,
        public telefono3?: string,           
        public cod_ubigeo?: string,
        public direccion?: string,
        public numero?: string,
        public piso?: string,
        public referencia?: string,        
        public proveedor?: string,
        public ubigeo?: Ubigeo,

        public credito?: number,
        public tipo_credito?: number,
        public estado?: number,
        public rol?: string
    ) {}

}