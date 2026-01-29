import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Delivery } from '../../../models/delivery.model';
import { DeliveryService } from '../../../services/delivery.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { CommonModule } from '@angular/common';
import { BackComponent } from '../../../shared/back/back.component';

@Component({
  selector: 'app-paso3',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    BackComponent
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
    } else {
      // Crear
      this.deliveryService.registro(data)
        .subscribe((resp: any) => {
          // Swal.fire('Creado', `${nombres_completos} creado correctamente`, 'success');
          console.log('Respuesta completa del servidor:', resp);

          // Extraer el ID de diferentes posibles estructuras de respuesta
          let deliveryId: string | undefined;

          // Intentar acceder como objeto con propiedad delivery
          const respObj = resp as { delivery?: { _id?: string }, _id?: string };
          if (respObj.delivery && respObj.delivery._id) {
            // Estructura: { ok: true, delivery: { _id: '...', ... } }
            this.delivery = { ...this.delivery, ...respObj.delivery } as Delivery;
            deliveryId = respObj.delivery._id;
          } else if (respObj._id) {
            // Estructura: { _id: '...', ... }
            this.delivery = resp;
            deliveryId = respObj._id;
          } else if (resp.ok && resp.msg) {
            // Estructura con mensaje, buscar en la respuesta
            console.warn('Respuesta con mensaje pero sin delivery:', resp);
          } else {
            console.warn('Estructura de respuesta no reconocida:', resp);
          }

          if (deliveryId) {
            this.router.navigate([`/delivery/paso4/`, deliveryId]);
          } else {
            console.error('No se pudo obtener el ID del delivery de la respuesta');
          }
        });
    }
  }


}
