import { Component, inject, Input } from '@angular/core';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { Delivery } from '../../models/delivery.model';
import { Usuario } from '../../models/usuario.model';
import { AsignardeliveryService } from '../../services/asignardelivery.service';
import { DeliveryService } from '../../services/delivery.service';
import { UsuarioService } from '../../services/usuario.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { OrderItemComponent } from '../order-item/order-item.component';

@Component({
  selector: 'app-orderlisthome',
   imports: [
      OrderItemComponent,
      LoadingComponent
  ],
  templateUrl: './orderlisthome.html',
  styleUrl: './orderlisthome.css',
})
export class Orderlisthome {

  @Input() identity!: string;
    @Input() identityId!: string;
    @Input() driverId!: string;
    @Input() asignacion!: any;
    @Input() status!: any;
    @Input() tipovehiculo!: any;
  
    asignacions!: Asignacion[];
    deliveries!: Delivery[];
  
    isLoading: boolean = false;
    user!: Usuario
    userId!: any;
    statusreqest!: string;
    iduserstatus!: string;
    message!:string
  
    private asignacionDService = inject(AsignardeliveryService);
    private userService = inject(UsuarioService);
    private deliveryService = inject(DeliveryService);
  
    ngOnInit() {
      this.identityId;
  
      let USER = localStorage.getItem("user");
      this.user = JSON.parse(USER || '{}');
  
      this.userId = this.user.uid;
  
      if (this.status && this.tipovehiculo) {
          this.loadDeliverysByStatusTipo();
        }
      
    }
  
  
    loadDeliverysByStatusTipo() {
    this.isLoading = true;
    this.deliveries = []; // Limpiamos la lista actual antes de buscar
  
    this.deliveryService.getDeliveryByStatusTipo(this.status, this.tipovehiculo).subscribe({
      next: (resp: any) => {
        // Si tu backend devuelve { deliveries: [...] }, usa resp.deliveries
        this.deliveries = resp.deliveries || resp;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando deliveries', err);
        this.deliveries = []; // Vaciamos la lista en caso de error
        this.isLoading = false; // ✅ Esto quita el loading aunque falle
      }
    });
  }

}
