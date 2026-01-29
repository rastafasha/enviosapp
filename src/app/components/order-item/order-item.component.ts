import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { Delivery } from '../../models/delivery.model';

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
  
}
