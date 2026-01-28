import { Component, inject, Input } from '@angular/core';
import { DireccionService } from '../../services/direccion.service';
import { Direccion } from '../../models/direccion.model';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Delivery } from '../../models/delivery.model';

@Component({
  selector: 'app-start-delivery',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './start-delivery.component.html',
  styleUrl: './start-delivery.component.scss'
})
export class StartDeliveryComponent {
  @Input() identity!:any;
   @Input() identityD!:string;
   @Input() identityId!:string;

    public deliveryForm!: FormGroup;
   
  direcciones: Direccion[] = [];
  delivery!: Delivery;
  isLoading = false;
  direccionSeleccionada:any;
  direccionRecogida:any;
  direccionEntrega:any;

   private _direccionService = inject(DireccionService);
   private fb = inject(FormBuilder);

  ngOnInit(){
    this.identityId;
    console.log(this.identityId)
   this.loadDirecciones();
   this.iniciarFormulario();
  }

  onSubmit(){

  }

 
  loadDirecciones(){  
    this.isLoading = true;
    this._direccionService.listarUsuario(this.identityId).subscribe({
      next: (data) => {
        this.direcciones = data.direcciones;
        console.log(this.direcciones);
        this.isLoading = false;
      }
    });
  }

  iniciarFormulario(){
    this.deliveryForm = this.fb.group({
      direccionRecogida: ['',Validators.required],
      direccionEntrega: ['',Validators.required],
      user: [this.identity?.uid],
    })
  }


  cargarMapa(){}

selectDireccion(direccion:any){
  this.direccionSeleccionada = direccion;
  console.log('Dirección seleccionada:', direccion);

  // Si direccionRecogida está vacía/null, guardar como pickup address
  if (!this.deliveryForm.get('direccionRecogida')?.value) {
    this.direccionRecogida = direccion;
    this.deliveryForm.get('direccionRecogida')?.setValue(direccion.nombres_completos);
    console.log('Guardada como direccionRecogida');
  }
  // Si direccionEntrega está vacía/null, guardar como delivery address
  else if (!this.deliveryForm.get('direccionEntrega')?.value) {
    this.direccionEntrega = direccion;
    this.deliveryForm.get('direccionEntrega')?.setValue(direccion.nombres_completos);
    console.log('Guardada como direccionEntrega');
  }
}
addRouta(direccion:any){
  // console.log(direccion)
  this.direccionRecogida = direccion;
}
addRoutaDestino(direccion:any){
  // console.log(direccion)
  this.direccionEntrega = direccion;
}


}
