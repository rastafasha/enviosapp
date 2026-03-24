import { CommonModule, NgFor, NgIf, ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewChecked, Component, DestroyRef, ElementRef,
  inject, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { UsuarioService } from '../../services/usuario.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Mensaje, Ticket } from '../../models/ticket.model';
import { Usuario } from '../../models/usuario.model';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { BackComponent } from '../../shared/back/back.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { DeliveryService } from '../../services/delivery.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Delivery } from '../../models/delivery.model';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgFor,
    BackComponent,
    LoadingComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('scrollMe') myScrollContainer!: ElementRef;

  urlSocket = environment.soketServer;
  public identity!: Usuario;
  public usuario!: any;
  public url!: string;
  public id!: string;
  public messageError = false;
  public mensajes: Mensaje[] = [];
  public msn!: string;
  msm_error!: string;
  public poster_admin!: string;
  public ticket!: Ticket;
  public delivery!: Delivery;
  public socket!: Socket;
  public close_ticket = false;
  public isLoading = false;
  public estado_ticket!: string;

  user: any
  identityId!: string;
  driverId!: string;

  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private viewportScroller = inject(ViewportScroller);

  private usuarioService = inject(UsuarioService);
  private _router = inject(Router);
  private http = inject(HttpClient);
  private _ticketService = inject(TicketService);
  private deliveryServices = inject(DeliveryService);

  ngOnInit() {
    // 1. Cargar usuario de sesión
    const userData = localStorage.getItem("user");
    if (!userData) return;
    this.user = JSON.parse(userData);
    this.identityId = this.user.uid;

    // 2. Flujo reactivo basado en la URL
    this.activatedRoute.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef),
      // Extraemos el ID de la URL
      map(params => params.get('id') || ''),
      // Encadenamos con la carga del Delivery
      switchMap(id => {
        this.id = id; // Guardamos el ordenId (o deliveryId)
        this.isLoading = true;
        return this.deliveryServices.getDeliveryId(this.id);
      })
    ).subscribe({
      next: (delivery: Delivery) => {
        this.delivery = delivery; // Tu objeto de la orden
        // Identificamos quién es el receptor (si yo soy USER, para es el CHOFER y viceversa)
        // Si soy USER (cliente), el 'para' es el chofer. 
        // Si soy CHOFER, el 'para' es el usuario (cliente).
        this.usuario = (this.user.role === 'USER') 
          ? delivery.driver  // <--- Asegúrate que este sea el campo del ID del chofer
          : delivery.user;    // <--- Y este el del cliente

        this.inicializarChat();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar delivery:', err);
        this.isLoading = false;
      }
    });
  }

  inicializarChat() {
    // Solo conectamos si no existe ya una conexión
    if (!this.socket) {
      this.socket = io(environment.soketServer);

      // Escuchamos al socket
      this.socket.on('new-mensaje', (data: any) => {
        // Cuando el otro envía un mensaje, recargamos la lista
        // Al recargar la lista, el scroll se ejecutará automáticamente (paso 3)
        this.listar_msms();
      });
      // Cuando el socket avise que algo cambió en el formulario/estado de la orden
    this.socket.on('new-formmsm', (data: any) => {
      if (data.data) {
        this.recargarDatosDelivery();
      }
    });
    }

    

    this.listar_msms();
    this.cargarPerfil();
  }

  // Para cuando el socket avisa que cambió el estado de la orden (ej: se cerró)
  recargarDatosDelivery() {
  this.deliveryServices.getDeliveryId(this.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((delivery: Delivery) => {
      this.delivery = delivery;
      // Actualizamos el destinatario por si acaso hubo cambios
      this.usuario = (this.user.role === 'USER') ? delivery.driver : delivery.user;
      console.log("Datos de la orden actualizados por socket");
    });
}

  sendMessage(msmForm: NgForm) {
    if (msmForm.invalid) return;

    const data = {
      de: this.user.uid,
      para: this.usuario, // El ID del otro participante que calculamos en el subscribe
      msm: msmForm.value.msm,
      delivery: this.id, // Cambiado de 'ticket' a 'delivery' según tu flujo
      status: this.close_ticket ? 0 : 1
    };

    this._ticketService.send(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (response: any) => {
        msmForm.controls['msm'].reset(); // Limpiamos input

        // Avisamos al servidor que enviamos algo
        this.socket.emit('save-mensaje', { new: true });

        // OJO: Como tú mismo disparaste el evento, el socket te responderá 
        // con 'new-mensaje' y eso ejecutará listar_msms() y el scroll.
      }
    );
  }

 

  listar_msms() {
    this._ticketService.get_ticketMensajes(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: Mensaje[]) => {
        this.mensajes = response;

        // EJECUTAR SCROLL AQUÍ CON UN PEQUEÑO DELAY
        setTimeout(() => {
          this.scrollToBottom();
        }, 100); // 100ms es suficiente para que Angular renderice el HTML
      });
  }
  cargarPerfil() {
    // Usamos el identityId que ya definimos en el ngOnInit
    this.usuarioService.get_user(this.identityId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.poster_admin = response.user?.perfil || 'default-avatar.png';
        },
        error: (error: any) => {
          console.error('Error cargando perfil:', error);
        }
      });
  }


  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTo({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        behavior: 'smooth' // Esto hace que se vea mucho más profesional
      });
    } catch (err) { }
  }



  ngOnDestroy(): void {
    this.socket?.disconnect();
  }



}
