import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Delivery } from '../../../models/delivery.model';
import { DeliveryService } from '../../../services/delivery.service';
import { BackComponent } from '../../../shared/back/back.component';
import { TipovehiculoService } from '../../../services/tipovehiculo.service';
import { TipoVehiculo } from '../../../models/tipovehiculo.model';
import { ItemcardComponent } from "../../../shared/itemcard/itemcard.component";
import { LoadingComponent } from "../../../shared/loading/loading.component";
import { ImagenPipe } from '../../../pipes/imagen-pipe.pipe';

@Component({
  selector: 'app-paso4',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    BackComponent,
    ItemcardComponent,
    LoadingComponent,
    ImagenPipe
  ],
  templateUrl: './paso4.component.html',
  styleUrl: './paso4.component.scss'
})
export class Paso4Component {
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
      this.getTiposVehiculo();
      this.iniciarFormulario();
    })
  }

  getTiposVehiculo() {
    this.tiposvService.getTiposVehics().subscribe((resp: any) => {
      this.tipos = resp
      // console.log(this.tipos)
    })
  }

  iniciarFormulario() {
    this.deliveryCarForm = this.fb.group({
      tipovehiculo: [this.delivery.tipovehiculo, Validators.required]
    })
  }

  onSubmit() {
    const { tipovehiculo, } = this.deliveryCarForm.value;

    // Incluir coordenadas si están disponibles
    const data: any = {
      ...this.deliveryCarForm.value,
       status: 'EDITANDO'
    };

    if (this.delivery && this.delivery._id) {
      // Actualizar
      data._id = this.delivery._id;
      this.deliveryService.update(data).subscribe(
        (resp: any) => {
          if (resp && resp.delivery && resp.delivery._id) {
            this.router.navigate([`/delivery/confirmar/`, this.delivery._id]);
          } else {
            console.error('Error: Respuesta de actualización no contiene _id', resp);
            this.router.navigate([`/delivery/confirmar/`, this.delivery._id]);
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
    // this.ngOnInit();

  }


}
