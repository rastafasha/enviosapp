import { Component, Input } from '@angular/core';
import { Delivery } from '../../models/delivery.model';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';

@Component({
  selector: 'app-itemcard',
  imports: [
    CommonModule,
    // ImagenPipe
  ],
  templateUrl: './itemcard.component.html',
  styleUrl: './itemcard.component.css'
})
export class ItemcardComponent {

  @Input() delivery!:Delivery;
  @Input() display:boolean = true ;
  

}
