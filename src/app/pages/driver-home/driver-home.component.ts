import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenufooterComponent } from '../../shared/menufooter/menufooter.component';
import { OrderListComponent } from "../../components/order-list/order-list.component";
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { AvisoComponent } from "../../shared/aviso/aviso.component";
import { LoadingComponent } from "../../shared/loading/loading.component";
import { NgIf } from '@angular/common';
import { Driver } from '../../models/driverp.model';
import { DriverpService } from '../../services/driverp.service';

@Component({
  selector: 'app-driver-home',
  imports: [
    HeaderComponent,
    MenufooterComponent,
    RouterModule,
    OrderListComponent,
    AvisoComponent,
    LoadingComponent,
    NgIf
],
  templateUrl: './driver-home.component.html',
  styleUrl: './driver-home.component.css'
})
export class DriverHomeComponent {
  identity!:Usuario;
  driver!:Driver;
  driverId!:string;
  identityId!:string;
  tipovehiculo!:string;
  isLoading= false;

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private driverService = inject(DriverpService);
  
  ngOnInit(){
    setTimeout(() => {
      this.loadIdentity();
    }, 500);
  }

  loadIdentity(){
    this.isLoading= true;
    let USER = localStorage.getItem("user");
    if(!USER){
      this.router.navigateByUrl('/login')
    }
    if(USER){
      let user = JSON.parse(USER);
      this.identityId = user.uid;
      this.usuarioService.get_user(this.identityId).subscribe((resp:any)=>{
        this.identity = resp.usuario;

         if( this.identity.role !== 'CHOFER'){
          this.router.navigateByUrl('/home-customer');
        }
        this.isLoading= false;
        // console.log(this.identity)
        this.loadIdentityD();
      })
    }
  }


   loadIdentityD() {
    this.isLoading = true;
   this.driverService.getByUserId(this.identityId).subscribe((resp: any) => {
        this.driver = resp
        this.driverId = resp._id;
        // console.log(this.identity)
        this.isLoading = false;
      this.tipovehiculo = this.driver.tipo_vehiculo
        
      })
  }
}
