import { Subcategoria } from './subcategoria.model';
export class Categoria {

    constructor(
        public id?: number,
        public nombre_categoria?: string,
        public subcategorias?: Subcategoria[],
        public estado?: boolean
    ) {}

}