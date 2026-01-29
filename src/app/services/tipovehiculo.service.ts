import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoVehiculo } from '../models/tipovehiculo.model';
const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class TipovehiculoService {
  serverUrl = environment.baseUrl;



  public tipo!: TipoVehiculo;

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }


  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }



  getTiposVehics() {
    const url = `${base_url}/tipovehiculo`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, tipos: TipoVehiculo[] }) => resp.tipos)
      )
  }

  getTiposVehicsActivas() {
    const url = `${base_url}/tipovehiculo/activas`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, tipos: TipoVehiculo[] }) => resp.tipos)
      )
  }
  getTiposVehicById(_id: string) {
    const url = `${base_url}/tipovehiculo/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, tipo: TipoVehiculo }) => resp.tipo)
      );

  }

  find_by_nombre(nombre: string): Observable<any> {
    const url = `${base_url}/tipovehiculo/name/${nombre}`;
    return this.http.get<any>(url)
      .pipe(
        map((resp: { ok: boolean, tipo: any }) => resp)
      );
  }

  registro(tipopago: TipoVehiculo) {
    const url = `${base_url}/tipovehiculo/registro`;
    return this.http.post(url, tipopago, this.headers);
  }

  update(tipopago: TipoVehiculo) {
    const url = `${base_url}/tipovehiculo/update/${tipopago._id}`;
    return this.http.put(url, tipopago, this.headers);
  }

  eliminar(id: string) {
    const url = `${base_url}/delivery/remove/${id}`;
    return this.http.delete(url, this.headers);
  }
}
