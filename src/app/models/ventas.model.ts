// import { Producto } from "./producto.model";
import { Usuario } from "./usuario.model";

export class Venta {
  constructor(
   public _id: string,
  public createdAt: string,
  public user: string,
  public local: string,
  public total_pagado: number,
  public info_cupon: string,
  public idtransaccion: string,
  public metodo_pago: string,
  public precio_envio: string,
  public tipo_envio: string,
  public tiempo_estimado: string,
  public direccion: string,
  public destinatario: string,
  public referencia: string,
  public pais: string,
  public detalle: Detalle,
  public zip: string,
  public ciudad: string,
  public tracking_number: string,
  public day: string,
  public month: string,
  public year: string,
  public estado: string,
  ){
    
  }
}


export class Cancelacion {
  constructor(
   public  _id: string,
  public createdAt: string,
  public mensaje: string,
  public estado: string,
  public user: string,
  public venta: string,
  ){}
}

export class Detalle {
  constructor(
   public  _id: string,
   public user: Usuario,
   public venta: Venta,
  //  public producto: Producto,
   public cantidad: string,
   public precio: string,
   public color: string,
   public selector: string,
  ){}
}
