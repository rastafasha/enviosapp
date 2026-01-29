import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Delivery } from '../../../models/delivery.model';
import { DeliveryService } from '../../../services/delivery.service';
import { BackComponent } from '../../../shared/back/back.component';

@Component({
  selector: 'app-paso4',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    BackComponent
],
  templateUrl: './paso4.component.html',
  styleUrl: './paso4.component.css'
})
export class Paso4Component {
   delivery!: Delivery;
      public deliveryForm!: FormGroup;
    
      isLoading = false;
      deliveryId:any;
    
      private deliveryService = inject(DeliveryService);
      private activatedRoute = inject(ActivatedRoute);
      private router = inject(Router);
      private fb = inject(FormBuilder);
    
    
      ngOnInit() {
        this.activatedRoute.params.subscribe(({ id }) => this.getDelivery(id));
        const id = this.deliveryId
      }
      getDelivery(id: string) {
        this.deliveryService.getDeliveryId(id).subscribe((resp: any) => {
          this.delivery = resp;
        })
      }
    
      iniciarFormulario() {
        this.deliveryForm = this.fb.group({
          fechaEnvio: ['', Validators.required],
          horaEnvio: ['', Validators.required],
        })
      }
  
      onSubmit() {
      const { nombres_completos, direccion, referencia, pais,
        ciudad, zip, user } = this.deliveryForm.value;
  
      // Incluir coordenadas si están disponibles
      const data: any = {
        ...this.deliveryForm.value,
      };
  
      if (this.delivery && this.delivery._id) {
        // Actualizar
        data._id = this.delivery._id;
        this.deliveryService.update(data).subscribe(
          (resp: any) => {
            if (resp && resp.delivery && resp.delivery._id) {
              this.router.navigate([`/delivery/paso4/`, resp.delivery._id]);
            } else {
              console.error('Error: Respuesta de actualización no contiene _id', resp);
            }
          });
      } 
    }
}
