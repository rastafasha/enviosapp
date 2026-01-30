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
    const id = this.deliveryId;
    this.validarFormulario();
  }

  getDelivery(id: string) {
    this.deliveryService.getDeliveryId(id).subscribe((resp: any) => {
      this.delivery = resp;
      console.log(this.delivery)
      this.deliverySizeForm.patchValue({
            // id: this._id,
            title: this.delivery.title,
            largo: this.delivery.largo,
            ancho: this.delivery.ancho,
            alto: this.delivery.alto,
            peso: this.delivery.peso,
          });
    })
  }


  validarFormulario() {
    this.deliverySizeForm = this.fb.group({
      title: ['', Validators.required],
      largo: ['', Validators.required],
      ancho: ['', Validators.required],
      alto: ['', Validators.required],
      peso: ['', Validators.required],
    })
  }



  onSubmit() {
    // if (this.deliverySizeForm.invalid) {
    //   return;
    // }

    const { title, largo, ancho, alto, peso } = this.deliverySizeForm.value;

    const data: any = {
      _id: this.delivery._id,
      title: title,
      largo: largo,
      ancho: ancho,
      alto: alto,
      peso: peso,
      status: 'EDITANDO'
    };

    if (this.delivery && this.delivery._id) {
      this.deliveryService.update(data).subscribe(
        (resp: any) => {
          if (resp && resp.delivery && resp.delivery._id) {
            this.router.navigate([`/delivery/paso3/`, this.delivery._id]);
          } else {
            // console.error('Error: Respuesta de actualización no contiene _id', resp);
            this.router.navigate([`/delivery/paso3/`, this.delivery._id]);
          }
        },
        (error) => {
          console.error('Error updating delivery:', error);
        }
      );
    }
  }

}
