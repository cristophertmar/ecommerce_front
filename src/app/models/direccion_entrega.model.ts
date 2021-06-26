export class DireccionEntrega {

    constructor(
        public departamento?: string,
        public provincia?: string,
        public distrito?: number,
        public direccion?: string,
        public numero?: string,
        public piso?: string,
        public referencia?: string,
    ) {}

}