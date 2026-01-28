import { Usuario } from "./usuario.model";
// import { Tienda } from "./tienda.model";
// import { Venta } from "./ventas.model";


export class Asignacion {
     constructor(
        public driver : Usuario,
        // public tienda : Tienda,
        // public venta: Venta,
        public status: string,
        public statusD: string,
        public statusC: string,
        public driverPosition: string,
        public deliveryPosition: string,
        public _id?: string
    
      ){
      }
}