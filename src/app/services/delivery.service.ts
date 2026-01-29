import { Injectable } from '@angular/core';
import { Delivery } from '../models/delivery.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  public delivery!: Delivery;
    public url;
  
    constructor(
      private _http: HttpClient,
      private router: Router,
      ) {
        this.url = environment.baseUrl;
    }
  
    get token():string{
      return localStorage.getItem('token') || '';
    }
  
  
    get headers(){
      return{
        headers: {
          'x-token': this.token
        }
      }
    }
  
  
  
    registro(delivery: Delivery){
      const url = `${base_url}/delivery/registro`;
      return this._http.post(url, delivery, this.headers);
    }
  
    listar():Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.get(this.url + '/delivery/',{headers:headers})
    }
  
    listarUsuario(id:string):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.get(this.url + '/delivery/user/'+id,{headers:headers})
  
    }
  
    getDeliveryId(id:string){
      const url = `${base_url}/delivery/show/${id}`;
      return this._http.get<any>(url, this.headers)
        .pipe(
          map((resp:{ok: boolean, delivery: Delivery}) => resp.delivery)
          );
    }
  
    update(delivery:Delivery){
      const url = `${base_url}/delivery/update/${delivery._id}`;
      return this._http.put(url, delivery, this.headers);
    }
  
    eliminar(id:string){
      const url = `${base_url}/delivery/remove/${id}`;
      return this._http.delete(url, this.headers);
    }
  
}
