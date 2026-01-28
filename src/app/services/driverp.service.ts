import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Driver } from '../models/driverp.model';
import { environment } from '../../environments/environment';
const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class DriverpService {

   constructor(
      private http: HttpClient
    ) { }
  
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
  
  
    gets(){
  
      const url = `${base_url}/driver`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp:{ok: boolean, drivers: Driver}) => resp.drivers)
        )
  
    }
  
  
    getById(_id: string){
      const url = `${base_url}/driver/${_id}`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp:{ok: boolean, driver: Driver}) => resp.driver)
          );
  
    }
    getByUserId(userid: string){
      const url = `${base_url}/driver/user/${userid}`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp:{ok: boolean, driver: Driver}) => resp.driver)
          );
  
    }
  
  
    create(driver: Driver){
      const url = `${base_url}/driver/store`;
      return this.http.post(url, driver, this.headers);
    }
  
    actualizar(driver: Driver){
      const url = `${base_url}/driver/update/${driver._id}`;
      return this.http.put(url, driver, this.headers);
    }
  
    borrar(_id:string){
      const url = `${base_url}/driver/remove/${_id}`;
      return this.http.delete(url, this.headers);
    }
}
