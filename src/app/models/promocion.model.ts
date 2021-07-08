export class Promocion {

    constructor(
        public id?: number,
        public descripcion?: string,
        public porcentaje?: number,
        public estado?: boolean,
        public vigencia_inicio?: string,
        public vigencia_fin?: string,
        public fecha_crea?: string,
    ) {}

}