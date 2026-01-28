import { Component, inject, Input } from '@angular/core';
import { MenufooterComponent } from "../../shared/menufooter/menufooter.component";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { LoadingComponent } from '../../shared/loading/loading.component';
import { CommonModule, CurrencyPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { AsignardeliveryService } from '../../services/asignardelivery.service';
import { Asignacion } from '../../models/asignaciondelivery.model';
import { Detalle, Venta } from '../../models/ventas.model';
import { ItemListComponent } from "../../components/item-list/item-list.component";
import { Driver } from '../../models/driverp.model';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';

@Component({
  selector: 'app-order-detail',
  imports: [
    MenufooterComponent, RouterLink,
    LoadingComponent, NgIf, SlicePipe, CurrencyPipe, 
    NgFor, CommonModule, ImagenPipe,
    ItemListComponent
],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {
  isLoading = false;
  identity!: Usuario;
  asignacion!: Asignacion;
  venta!: Venta;
  driver!: Driver;
  driverId!: any;
  userDriver!:Usuario;
  @Input() detalles!: Detalle[];

  private usuarioService = inject(UsuarioService);
  private activatedRoute = inject(ActivatedRoute);
  private asignacionDServices = inject(AsignardeliveryService);

  ngOnInit() {
    this.loadIdentity();
    this.activatedRoute.params.subscribe(params => {
      let orderId = params['id'];
      // console.log(orderId);
      this.getAsignacionById(orderId);
    });
  }

  loadIdentity() {
    let USER = localStorage.getItem("user");
    if (USER) {
      let user = JSON.parse(USER);
      this.usuarioService.get_user(user.uid).subscribe((resp: any) => {
        this.identity = resp.usuario;

      })
    }
  }

  getAsignacionById(id: string) {
    this.isLoading = true;
    this.asignacionDServices.getById(id).subscribe((resp: any) => {
      // console.log(resp);
      this.asignacion = resp
      this.venta = resp.venta;
      this.driver = resp.driver;
      this.driverId = this.driver.user;
      this.isLoading = false;
      this.getUsuarioDriver();
    });
  }

  getUsuarioDriver(){
    this.usuarioService.get_user(this.driverId).subscribe((resp:any)=>{
      this.userDriver = resp.usuario;
    });
  }
  //actualizamos es status de la asignacion a 'EN PROCESO' cuando el chofer aplica para entregar el pedido
  activarDelivery(){
 
    this.asignacionDServices.activar(this.asignacion._id).subscribe((resp:any)=>{
      // console.log(resp);
      this.asignacion = resp.asignacion;
      this.ngOnInit();
    }); 
  }

  marcarEntregado(){
 
    this.asignacionDServices.entregado(this.asignacion._id).subscribe((resp:any)=>{
      // console.log(resp);
      this.asignacion = resp.asignacion;
      this.ngOnInit();
    }); 
  }
  marcarRecibido(){
 
    this.asignacionDServices.recibido(this.asignacion._id).subscribe((resp:any)=>{
      // console.log(resp);
      this.asignacion = resp.asignacion;
      this.ngOnInit();
    }); 
  }
  



}
