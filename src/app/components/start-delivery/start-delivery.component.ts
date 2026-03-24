import { Component, inject, Input } from '@angular/core';
import { DireccionService } from '../../services/direccion.service';
import { Direccion } from '../../models/direccion.model';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Delivery } from '../../models/delivery.model';
import { DeliveryService } from '../../services/delivery.service';
import { ItemcardComponent } from "../../shared/itemcard/itemcard.component";
import { LoadingComponent } from "../../shared/loading/loading.component";
import { BackComponent } from "../../shared/back/back.component";

@Component({
  selector: 'app-start-delivery',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ItemcardComponent,
    LoadingComponent,
    BackComponent
  ],
  templateUrl: './start-delivery.component.html',
  styleUrl: './start-delivery.component.scss'
})
export class StartDeliveryComponent {
  @Input() identity!: any;
  @Input() identityD!: string;
  @Input() identityId!: string;

  public deliveryForm!: FormGroup;

  direcciones: Direccion[] = [];
  delivery!: Delivery;
  isLoading = false;
  direccionSeleccionada: any;
  direccionRecogida: any;
  direccionEntrega: any;
  user: any;

  private _direccionService = inject(DireccionService);
  private deliveryService = inject(DeliveryService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  ngOnInit() {

    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : ''); 
    this.identityId = this.user.uid;

    if (this.user.role === 'CHOFER') {
      this.activatedRoute.params.subscribe(({ id }) => this.getDelivery(id));
    }
    if (this.user.role === 'USER') {
      this.loadDirecciones();
      this.iniciarFormulario();

    }
    
  }


  getDelivery(id: string) {
    this.deliveryService.getDeliveryId(id).subscribe((resp: any) => {
      this.delivery = resp;
      this.iniciarFormulario();
      this.loadDirecciones();
    })
  }


  loadDirecciones() {
    this.isLoading = true;
    this._direccionService.listarUsuario(this.identityId).subscribe({
      next: (data) => {
        this.direcciones = data.direcciones;
        this.isLoading = false;
      }
    });
  }

  iniciarFormulario() {
    this.deliveryForm = this.fb.group({
      direccionRecogida: ['', Validators.required],
      direccionEntrega: ['', Validators.required],
      user: [this.identity?.uid],
    })
  }


 

  selectDireccion(direccion: any) {
    this.direccionSeleccionada = direccion;

    // Si direccionRecogida está vacía/null, guardar como pickup address
    if (!this.deliveryForm.get('direccionRecogida')?.value) {
      this.direccionRecogida = direccion;
      this.deliveryForm.get('direccionRecogida')?.setValue(direccion.nombres_completos);
    }
    // Si direccionEntrega está vacía/null, guardar como delivery address
    else if (!this.deliveryForm.get('direccionEntrega')?.value) {
      this.direccionEntrega = direccion;
      this.deliveryForm.get('direccionEntrega')?.setValue(direccion.nombres_completos);
    }
  }
  addRouta(direccion: any) {
    // console.log(direccion)
    this.direccionRecogida = direccion;
  }
  addRoutaDestino(direccion: any) {
    // console.log(direccion)
    this.direccionEntrega = direccion;
  }


  onSubmit() {
    const { nombres_completos, direccion, referencia, pais,
      ciudad, zip, user } = this.deliveryForm.value;

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
            this.router.navigate([`/delivery/paso2/`, resp.delivery._id]);
          } else {
            console.error('Error: Respuesta de actualización no contiene _id', resp);
            this.router.navigate([`/delivery/paso2/`, this.delivery._id]);
          }
        });
    } else {
      // Crear
      this.deliveryService.registro(data)
        .subscribe((resp: any) => {
          // Swal.fire('Creado', `${nombres_completos} creado correctamente`, 'success');

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
            this.router.navigate([`/delivery/paso2/`, deliveryId]);
          } else {
            console.error('No se pudo obtener el ID del delivery de la respuesta');
          }
        });
    }
  }


}
