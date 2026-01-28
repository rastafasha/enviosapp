import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { AvisoComponent } from "../aviso/aviso.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

   private usuarioService = inject(UsuarioService);
  
  ngOnInit(){

    
  }

  logout(){
    this.usuarioService.logout();
  }
}

