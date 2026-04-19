import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { Delivery } from '../../models/delivery.model';
import { Usuario } from '../../models/usuario.model';
import { DeliveryService } from '../../services/delivery.service';

@Component({
  selector: 'app-order-item',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.css'
})
export class OrderItemComponent {
  @Input() statustText!:string;
  @Input() asignacion!:Asignacion;
  @Input() delivery!:Delivery;
  @Input() identity!:any;

  private deliveryService = inject(DeliveryService);

  deleteItem(id:any){
    this.deliveryService.eliminar(id).subscribe((resp:any)=>{
      console.log(resp)
    })
  }
  
}
