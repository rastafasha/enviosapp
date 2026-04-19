export class Direccion{
    constructor(
        public _id: string,
        public nombre_ubicacion: string,
        public direccion: string,
        public referencia : string,
        public user: string,
        public latitud?: number,
        public longitud?: number,
    ){
    }
}
