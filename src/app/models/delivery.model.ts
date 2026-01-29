import { Usuario } from "./usuario.model";
import { environment } from "../../environments/environment";
import { TipoVehiculo } from "./tipovehiculo.model";
import { Direccion } from "./direccion.model";

const base_url = environment.mediaUrlRemoto;
export class Delivery {
     constructor(
        public user : Usuario,
        public status: string,
        public titulo: string,
        public img: string,
        public descripcion: string,
        public direccionRecogida: Direccion,
        public direccionEntrega: Direccion,
        public largo: string,
        public tipovehiculo: TipoVehiculo,
        public ancho: string,
        public alto: string,
        public peso: string,
        public fechaEnvio: string,
        public horaEnvio: string,
        public _id?: string
    
      ){
      }

      get imagenUrl(){

    if(!this.img){
      return `${base_url}/uploads/deliverys/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/uploads/deliverys/${this.img}`;
    }else {
      return `${base_url}/uploads/deliverys/no-image.jpg`;
    }

  }
}