import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-menufooter',
  imports: [
    RouterModule,
    NgIf
],
  templateUrl: './menufooter.component.html',
  styleUrl: './menufooter.component.css'
})
export class MenufooterComponent {

  identity!:Usuario;
    isLoading= false;
  
    private usuarioService = inject(UsuarioService);
    private router = inject(Router);
    
    ngOnInit(){
       setTimeout(() => {
      }, 500);
      this.loadIdentity();
    }
  
    loadIdentity(){
      let USER = localStorage.getItem("user");
      if(!USER){
        this.router.navigateByUrl('/login')
      }
      if(USER){
        let user = JSON.parse(USER);
        this.usuarioService.get_user(user.uid).subscribe((resp:any)=>{
          this.identity = resp.usuario;
        })
      }
    }

}
