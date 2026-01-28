import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenufooterComponent } from '../../shared/menufooter/menufooter.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-delivery-status',
  imports: [
     MenufooterComponent,
     RouterModule
  ],
  templateUrl: './delivery-status.component.html',
  styleUrl: './delivery-status.component.css'
})
export class DeliveryStatusComponent {

}
