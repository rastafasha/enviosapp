import { Component, inject } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { DriverpService } from '../../services/driverp.service';
import { Driver } from '../../models/driverp.model';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { CommonModule, NgIf } from '@angular/common';
import { AvisoComponent } from "../../shared/aviso/aviso.component";
import { RouterModule } from '@angular/router';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';
import { DireccionesComponent } from "./direcciones/direcciones.component";
import { BackComponent } from "../../shared/back/back.component";

@Component({
  selector: 'app-profile',
  imports: [
    MenufooterComponent,
    LoadingComponent, NgIf,
    CommonModule,
    RouterModule,
    ImagenPipe,
    AvisoComponent,
    DireccionesComponent,
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
identity!:Usuario;
driver!:Driver;
identityId!:any;
isLoading = false;
isLoadingDr = false;
pageTitle = 'Mi Perfil';

  private usuarioService = inject(UsuarioService);
  private driverpService = inject(DriverpService);
  
  ngOnInit(){
    this.loadIdentity();
  }

  loadIdentity(){
    this.isLoading = true;
    let USER = localStorage.getItem("user");
    if(USER){
      let user = JSON.parse(USER);
      this.usuarioService.get_user(user.uid).subscribe((resp:any)=>{
        this.identity = resp.usuario;
        this.identityId = this.identity.uid;
        this.isLoading = false;
        setTimeout(()=>{
          this.loadDriverProfile();
        }, 1000)
      })
    }
  }

  loadDriverProfile(){
     this.isLoadingDr = true;
    this.driverpService.getByUserId(this.identityId).subscribe((resp:any)=>{
        this.driver = resp;
        this.isLoadingDr = false;
      })
  }
}
