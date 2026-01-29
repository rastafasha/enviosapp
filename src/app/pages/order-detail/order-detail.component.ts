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
import { DeliveryService } from '../../services/delivery.service';
import { Delivery } from '../../models/delivery.model';
import { ItemcardComponent } from "../../shared/itemcard/itemcard.component";
import { BackComponent } from "../../shared/back/back.component";

@Component({
  selector: 'app-order-detail',
  imports: [
    MenufooterComponent, RouterLink,
    LoadingComponent, NgIf, SlicePipe,
    CommonModule, ImagenPipe,
    ItemcardComponent,
    BackComponent
],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {
  isLoading = false;
  identity!: Usuario;
  delivery!: any;
  venta!: Venta;
  driver!: Driver;
  driverId!: any;
  userDriver!:Usuario;
  @Input() detalles!: Detalle[];
  display:boolean = false;
   public whatsapp !:string;

  private usuarioService = inject(UsuarioService);
  private activatedRoute = inject(ActivatedRoute);
  private deliveryServices = inject(DeliveryService);

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
    this.deliveryServices.getDeliveryId(id).subscribe((resp: any) => {
      this.delivery = resp;
      this.isLoading = false;
      this.getUsuario();
    });
  }
  getUsuario(){
    this.usuarioService.get_user(this.delivery.user ).subscribe((resp:any)=>{
      this.userDriver = resp.usuario;
    });
  }
  
  //actualizamos es status de la asignacion a 'EN PROCESO' cuando el chofer aplica para entregar el pedido
  activarDelivery(){
 
    this.deliveryServices.activar(this.delivery._id).subscribe((resp:any)=>{
      // console.log(resp);
      this.delivery = resp.delivery;
      this.ngOnInit();
    }); 
  }

  marcarEntregado(){
 
    this.deliveryServices.entregado(this.delivery._id).subscribe((resp:any)=>{
      // console.log(resp);
      this.delivery = resp.delivery;
      this.ngOnInit();
    }); 
  }
  marcarRecibido(){
 
    this.deliveryServices.recibido(this.delivery._id).subscribe((resp:any)=>{
      // console.log(resp);
      this.delivery = resp.delivery;
      this.ngOnInit();
    }); 
  }

  total() {
    // const total = this.bandejaList.reduce((sum, item) =>
    //   sum + item.precio_ahora * item.cantidad, 0
    // );
    // return total;
  }

  // Generate WhatsApp message with order items
  getWhatsAppMessage(): string {

    if (!this.identity || !this.delivery) {
      return '';
    }

    let message = `*Nuevo Pedido desde app Delivery #${this.delivery._id}*\n\n`;
    message += `*Chofer:* ${this.identity.first_name} ${this.identity.last_name}\n`;
    message += `*Teléfono:* ${this.identity.telefono || 'No registrado'}\n\n`;
    message += `*Detalles del Delivery:*\n`;
    message += `─────────────────────\n`;
    message += `*titulo:* ${this.delivery.titulo || 'No registrado'}\n\n`;
    message += `*tipo vehiculo:* ${this.delivery.tipovehiculo || 'No registrado'}\n\n`;
    message += `*fecha Envio:* ${this.delivery.fechaEnvio || 'No registrado'}\n\n`;
    message += `*hora Envio:* ${this.delivery.horaEnvio || 'No registrado'}\n\n`;
    message += `*Desde:* ${this.delivery.direccionRecogida || 'No registrado'}\n\n`;
    message += `*Hasta:* ${this.delivery.direccionEntrega || 'No registrado'}\n\n`;

    // this.delivery.forEach((item: any) => {
    //   const itemTotal = (item.precio_ahora * item.cantidad).toFixed(2);
    //   message += `• ${item.titulo || item.titulo}\n`;
    //   if(item.subcategoria === 'Pastas'){
    //     message += `• ${item.nombre_selector}\n`;
    //   }
    //   message += `  Cant: ${item.cantidad} x ${item.precio_ahora.toFixed(2)} = ${itemTotal}\n\n`;
    // });

    message += `─────────────────────\n`;
    // message += `*TOTAL:*  ${this.total().toFixed(2)}\n\n`;
    message += `Por favor confirmar entre en la app, confirme el delivery.`;
    message += `Por favor confirmar disponibilidad y método de pago.`;

    return encodeURIComponent(message);
  }

  // Open WhatsApp with pre-filled message
  sendWhatsAppOrder(): void {
    this.whatsapp = this.userDriver.telefono;
    const phone = this.whatsapp.replace(/\D/g, '');
    const message = this.getWhatsAppMessage();

    if (message) {
      const url = `https://wa.me/${phone}?text=${message}`;
      window.open(url, '_blank');
    }
    // console.log(message)
    // this.guardarPedido();
  }
  



}
