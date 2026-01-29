import { Component, inject, Input } from '@angular/core';
import { OrderItemComponent } from "../order-item/order-item.component";
import { AsignardeliveryService } from '../../services/asignardelivery.service';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { DeliveryService } from '../../services/delivery.service';
import { Delivery } from '../../models/delivery.model';

@Component({
  selector: 'app-order-list',
  imports: [
    OrderItemComponent, CommonModule, NgFor, LoadingComponent,
    NgIf
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {

  @Input() identity!:string;
  @Input() identityId!:string;
  @Input() driverId!:string;
  @Input() asignacion!: any;
  @Input() status!: any;
  asignacions!: Asignacion [];
  deliveries!: Delivery [];

  isLoading: boolean = false;
  user!:Usuario
  userId!:any;
  statusreqest!:string;
  iduserstatus!:string;

  private asignacionDService = inject(AsignardeliveryService);
  private userService = inject(UsuarioService);
  private deliveryService = inject(DeliveryService);

  ngOnInit(){
    this.identityId;

    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER || '{}');

    this.userId = this.user.uid;
    
    if(this.user.role == 'CHOFER'){
        // this.loadAsignaciones();
      } else {
        this.loadAsignacionesByUser();
      }
      
      if(this.status ){
        this.loadAsignacionesByStatus();
      }
    
    // setTimeout(() => {
    // }, 500);
  }

  loadAsignaciones(){
    this.isLoading = true;
    this.asignacionDService.getByDriverId(this.identityId).subscribe((resp:any)=>{  
      this.asignacions = resp;
       this.isLoading = false;
    });

  }

  loadAsignacionesByUser(){
    this.isLoading = true;
    this.deliveryService.listarUsuario(this.userId).subscribe((resp:any)=>{
      this.deliveries = resp.deliveries;
       this.isLoading = false;
    });
  }
  
  loadAsignacionesByStatus(){
    this.isLoading = true;
    this.deliveryService.getDeliveryByStatus(this.status).subscribe((resp:any)=>{
      this.deliveries = resp;
       this.isLoading = false;
    });
  }
  


}
