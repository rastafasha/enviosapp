import { Usuario } from "./usuario.model";
// import { Tienda } from "./tienda.model";
// import { Venta } from "./ventas.model";


export class Delivery {
     constructor(
        public usuario : Usuario,
        public status: string,
        public titulo: string,
        public img: string,
        public descripcion: string,
        public direccionRecogida: string,
        public direccionEntrega: string,
        public largo: string,
        public ancho: string,
        public alto: string,
        public peso: string,
        public fechaEnvio: string,
        public horaEnvio: string,
        public _id?: string
    
      ){
      }
}