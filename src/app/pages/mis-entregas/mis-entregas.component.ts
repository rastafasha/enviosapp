import { Component, inject, Input } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { OrderItemComponent } from "../../components/order-item/order-item.component";
import { CommonModule, NgIf } from '@angular/common';
import { OrderListComponent } from "../../components/order-list/order-list.component";
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { DriverpService } from '../../services/driverp.service';
import { DeliveryService } from '../../services/delivery.service';

@Component({
  selector: 'app-mis-entregas',
  imports: [
    MenufooterComponent, CommonModule,
    OrderListComponent
  ],
  templateUrl: './mis-entregas.component.html',
  styleUrl: './mis-entregas.component.scss'
})
export class MisEntregasComponent {
  @Input() identityId!: string;
  
  option_selectedd: number = 1;
  identity!: any;
  user!: any;
  solicitud_selectedd: any = 1;

  isLoading = false;
  statusD = 'Confirmado';
  statusC = 'Confirmado';

  private driverService = inject(DriverpService);
  
  private router = inject(Router);


  ngOnInit() {
    this.loadIdentity();
    // setTimeout(() => {
    // }, 500);
  }


  loadIdentity() {
    this.isLoading = true;
    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
    
    if (!this.user) {
      this.router.navigateByUrl('/login')
    }
    if (this.user.role === 'CHOFER' ) {
      this.driverService.getByUserId(this.user.uid).subscribe((resp: any) => {
        this.identity = resp
        this.identityId = resp._id;
      })
    }
    this.isLoading = false;

  }


   optionSelected(value: number) {
    this.option_selectedd = value;
    if (this.option_selectedd === 1) {

      // this.ngOnInit();
    }
    if (this.option_selectedd === 2) {
      this.solicitud_selectedd = null;
    }
    if (this.option_selectedd === 3) {
      this.solicitud_selectedd = null;
    }
  }

}
