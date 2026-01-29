import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Delivery } from '../../../models/delivery.model';
import { DeliveryService } from '../../../services/delivery.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { CommonModule } from '@angular/common';
import { BackComponent } from '../../../shared/back/back.component';
import { ItemcardComponent } from "../../../shared/itemcard/itemcard.component";
import { LoadingComponent } from "../../../shared/loading/loading.component";

@Component({
  selector: 'app-paso3',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    BackComponent,
    ItemcardComponent,
    LoadingComponent
],
  templateUrl: './paso3.component.html',
  styleUrl: './paso3.component.css'
})
export class Paso3Component {

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
        this.iniciarFormulario();
      })
    }
  
    iniciarFormulario() {
      this.deliveryForm = this.fb.group({
        fechaEnvio: [this.delivery.fechaEnvio, Validators.required],
        horaEnvio: [this.delivery.horaEnvio, Validators.required],
      })
    }

    onSubmit() {
    const { fechaEnvio, horaEnvio} = this.deliveryForm.value;

    // Incluir coordenadas si están disponibles
    const data: any = {
      ...this.deliveryForm.value,
       status: 'EDITANDO'
    };

    if (this.delivery && this.delivery._id) {
      // Actualizar
      data._id = this.delivery._id;
      this.deliveryService.update(data).subscribe(
        (resp: any) => {
          if (resp && resp.delivery && resp.delivery._id) {
            this.router.navigate([`/delivery/paso4/`, this.delivery._id]);
          } else {
            console.error('Error: Respuesta de actualización no contiene _id', resp);
            this.router.navigate([`/delivery/paso4/`, this.delivery._id]);
          }
        });
    } 
  }


}
