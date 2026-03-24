import { CommonModule, NgFor, NgIf, ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, Component, DestroyRef, ElementRef, 
  inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgFor,
    BackComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy{

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  urlSocket = environment.soketServer;
  public identity!: Usuario;
  public usuario!: Usuario;
  public url!: string;
  public id!: string;
  public messageError = false;
  public mensajes: Mensaje[] = [];
  public msn!: string;
  msm_error!: string;
  public poster_admin!: string;
  public ticket!: Ticket;
  public socket!: Socket;
  public close_ticket = false;
  public estado_ticket!: string;

  user: any
  identityId!: string;

  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
   private viewportScroller = inject(ViewportScroller);

    private usuarioService= inject(UsuarioService) ;
    private _router= inject(Router) ;
    private http= inject(HttpClient) ;
    private _ticketService= inject(TicketService) ;

  ngOnInit(){

    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    this.identityId = this.user.uid;

    this.viewportScroller.scrollToPosition([0, 0]);
    this.activatedRoute.params.subscribe(params => {
      let orderId = params['id'];
      
    });

    if (this.identity) {
      this.url = environment.baseUrl;
      this.urlSocket = environment.soketServer;
      this.socket = io(this.urlSocket);

      this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
        params => {
          this.id = params.get('id') || '';
        }
      );

      this.socket.on('new-formmsm', (data: any) => {
        if (data.data) {
          this._ticketService.get_ticket(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
            (response: any) => {
              console.log(response);
              this.ticket = response;
              this.usuario = (this.ticket as any).usuario;
              // this.estado_ticket = this.ticket.estado.toString();
            },
            (error: any) => {
              console.log(error);
            }
          );
        }
      });

      this.socket.on('new-mensaje', (data: any) => {
        this.mensajes = [];
        this.listar_msms();
      });

      this.usuarioService.get_user(this.identityId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
        (response: any) => {
          this.poster_admin = response.user.perfil;
        },
        (error: any) => {
          console.log(error);
        }
      );

      this._ticketService.get_ticket(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
        (response: any) => {
          this.ticket = response;
          // this.estado_ticket = this.ticket.estado.toString();
          this.usuario = (this.ticket as any).usuario;
        },
        (error: any) => {
          console.log(error);
        }
      );
      this.listar_msms();

    } 
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.socket?.disconnect();
  }

  listar_msms() {
    this._ticketService.get_ticketMensajes(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (response: Mensaje[]) => {
        this.mensajes = response;
        this.scrollToBottom();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  sendMessage(msmForm: NgForm) {
    if (msmForm.valid) {
      const data = {
        de: this.identity.uid,
        para: this.usuario,
        msm: msmForm.value.msm,
        ticket: this.id,
        status: this.close_ticket ? 0 : 1,
        estado: this.close_ticket ? 0 : null
      };
      this._ticketService.send(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
        (response: any) => {
          console.log(response);
          this.msn = '';
          this.socket.emit('save-mensaje', { new: true });
          this.scrollToBottom();
          if (this.close_ticket) {
            this.socket.emit('save-formmsm', { data: true });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      this.messageError = true;
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  

}
