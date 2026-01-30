import { environment } from "../../environments/environment";

const base_url = environment.baseUrl;

export class TipoVehiculo{
  constructor(
    public nombre : string,
    public icono: string,
    public img: string,
    public precio: number,
    public status: string,
    public _id?: string

  ){}

}

