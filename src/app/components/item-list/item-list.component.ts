import { Component, Input } from '@angular/core';
import { Detalle } from '../../models/ventas.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';

@Component({
  selector: 'app-item-list',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {

  @Input() detalle!:Detalle;

}
