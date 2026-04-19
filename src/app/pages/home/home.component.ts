import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenufooterComponent } from '../../shared/menufooter/menufooter.component';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

import { LoadingComponent } from '../../shared/loading/loading.component';
import { AsignardeliveryService } from '../../services/asignardelivery.service';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { StartDeliveryComponent } from "../../components/start-delivery/start-delivery.component";
import { OrderListComponent } from '../../components/order-list/order-list.component';
import { PwaNotifInstallerComponent } from "../../shared/pwa-notif-installer/pwa-notif-installer.component";
@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    MenufooterComponent,
    RouterModule,
    LoadingComponent,
    StartDeliveryComponent,
    PwaNotifInstallerComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  identity!: Usuario;
  userId!: string;
  identityId!: any;
  user!: any;
  isLoading = false;
  asignacion!: Asignacion;
  isOnline = navigator.onLine;

  private usuarioService = inject(UsuarioService);
  private asignacionDServices = inject(AsignardeliveryService);
  private router = inject(Router);

  ngOnInit() {

    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    this.identityId = this.user.uid;
    this.loadIdentity();
  }

  loadIdentity() {
    this.isLoading = true;
    this.usuarioService.get_user(this.identityId).subscribe((resp: any) => {
        this.identity = resp.usuario;
        this.identityId = this.identity.uid;
        this.isLoading = false;
      })
  }

  // Función que dispara el refresco
  async myRefreshEvent(event: any) {
    // Solo intentamos vibrar si es un móvil (evita el error en Chrome Desktop)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.vibrate) {
      try { navigator.vibrate(40); } catch (e) { /* Silencio */ }
    }

    // Lógica de carga
    try {
      await this.loadIdentity();
    } finally {
      // Si event.complete() no funciona, forzamos con un pequeño retraso
      setTimeout(() => {
        if (event && typeof event.complete === 'function') {
          event.complete();
        }
      }, 100);
    }
  }




}
