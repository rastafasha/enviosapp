import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeliveryService } from '../../../services/delivery.service';
import { Delivery } from '../../../models/delivery.model';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../../services/file-upload.service';
import Swal from 'sweetalert2';
import { BackComponent } from "../../../shared/back/back.component";
import { ItemcardComponent } from "../../../shared/itemcard/itemcard.component";
import { LoadingComponent } from "../../../shared/loading/loading.component";

@Component({
  selector: 'app-paso2',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    BackComponent,
    ItemcardComponent,
    LoadingComponent
],
  templateUrl: './paso2.component.html',
  styleUrl: './paso2.component.css'
})
export class Paso2Component {

  delivery!: Delivery;
  public deliverySizeForm!: FormGroup;

  public imagenSubir!: File;
  public imgTemp: any = null;
  isLoading = false;
  deliveryId:any;
  id:any;

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
      console.log(this.delivery)
      this.iniciarFormulario();
    })
  }

  iniciarFormulario() {
    this.deliverySizeForm = this.fb.group({
      titulo: [this.delivery.titulo, Validators.required],
      largo: [this.delivery.largo, Validators.required],
      ancho: [this.delivery.ancho, Validators.required],
      alto: [this.delivery.alto, Validators.required],
      peso: [this.delivery.peso, Validators.required],
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
    const { titulo, largo, ancho, alto,
      peso,} = this.deliverySizeForm.value;

    // Incluir coordenadas si están disponibles
    const data: any = {
      _id:this.delivery._id,
      ...this.deliverySizeForm.value,
      status: 'EDITANDO'
    };

    if (this.delivery && this.delivery._id) {
      // Actualizar
      data._id = this.delivery._id;
      this.deliveryService.update(data).subscribe(
        (resp: any) => {
          if (resp && resp.delivery && resp.delivery._id) {
            this.router.navigate([`/delivery/paso3/`, this.delivery._id]);
          } else {
            console.error('Error: Respuesta de actualización no contiene _id', resp);
             this.router.navigate([`/delivery/paso3/`, this.delivery._id]);
          }
        });
    } 
  }

}
