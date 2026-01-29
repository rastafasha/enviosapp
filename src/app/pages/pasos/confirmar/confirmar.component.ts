import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Delivery } from '../../../models/delivery.model';
import { TipoVehiculo } from '../../../models/tipovehiculo.model';
import { DeliveryService } from '../../../services/delivery.service';
import { TipovehiculoService } from '../../../services/tipovehiculo.service';
import { CommonModule } from '@angular/common';
import { BackComponent } from '../../../shared/back/back.component';
import { ItemcardComponent } from '../../../shared/itemcard/itemcard.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
  selector: 'app-confirmar',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    BackComponent,
    ItemcardComponent,
    LoadingComponent
  ],
  templateUrl: './confirmar.component.html',
  styleUrl: './confirmar.component.css'
})
export class ConfirmarComponent {
  delivery!: Delivery;
    public deliveryCarForm!: FormGroup;
    tipo!: TipoVehiculo;
    tipos!: TipoVehiculo[];
    isLoading = false;
    deliveryId: any;
  
    private deliveryService = inject(DeliveryService);
    private tiposvService = inject(TipovehiculoService);
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
         this.iniciarFormulario();
      })
    }
  
  
    iniciarFormulario() {
      this.deliveryCarForm = this.fb.group({
        descripcion: [this.delivery.descripcion]
      })
    }
  
    onSubmit() {
      const { descripcion, } = this.deliveryCarForm.value;
  
      // Incluir coordenadas si están disponibles
      const data: any = {
        ...this.deliveryCarForm.value,
        status: 'ESPERANDO'
      };
  
      if (this.delivery && this.delivery._id) {
        // Actualizar
        data._id = this.delivery._id;
        this.deliveryService.update(data).subscribe(
          (resp: any) => {
            if (resp && resp.delivery && resp.delivery._id) {
              this.router.navigate([`/mis-entregas`]);
            } else {
              console.error('Error: Respuesta de actualización no contiene _id', resp);
              this.router.navigate([`/mis-entregas`]);
            }
          });
      }
    }
  
  
    selectCar(tipo: TipoVehiculo) {
      this.tipo = tipo;
  
      // Si tipovehiculo está vacía/null, guardar como pickup address
      if (!this.deliveryCarForm.get('tipovehiculo')?.value) {
        this.tipo = tipo;
        this.deliveryCarForm.get('tipovehiculo')?.setValue(tipo.nombre);
        console.log('Guardada como tipovehiculo');
      }
  
    }
}
