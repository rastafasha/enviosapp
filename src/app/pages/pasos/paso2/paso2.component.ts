import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeliveryService } from '../../../services/delivery.service';
import { Delivery } from '../../../models/delivery.model';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../../services/file-upload.service';
import Swal from 'sweetalert2';
import { BackComponent } from "../../../shared/back/back.component";

@Component({
  selector: 'app-paso2',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    BackComponent
],
  templateUrl: './paso2.component.html',
  styleUrl: './paso2.component.css'
})
export class Paso2Component {

  delivery!: Delivery;
  public deliveryForm!: FormGroup;

  public imagenSubir!: File;
  public imgTemp: any = null;
  isLoading = false;
  deliveryId:any;

  private deliveryService = inject(DeliveryService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private fileUploadService = inject(FileUploadService);
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
      titulo: ['', Validators.required],
      largo: ['', Validators.required],
      ancho: ['', Validators.required],
      alto: ['', Validators.required],
      peso: ['', Validators.required],
    })
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;

    // if (!file) {
    //   return this.imgTemp = null;
    // }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.isLoading = true;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'deliverys', this.deliveryId)
      .then(img => {
        this.delivery.img = img;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');
        this.isLoading = false;
        this.ngOnInit()
      }).catch(err => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        this.isLoading = false;
        this.ngOnInit()
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
            this.router.navigate([`/delivery/paso3/`, resp.delivery._id]);
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
            this.router.navigate([`/delivery/paso3/`, deliveryId]);
          } else {
            console.error('No se pudo obtener el ID del delivery de la respuesta');
          }
        });
    }
  }

}
