import { Component, OnInit, AfterViewChecked, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { Location, NgFor, NgIf } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ViewportScroller } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario.model';
import { Mensaje, Ticket } from '../../models/ticket.model';
import { UsuarioService } from '../../services/usuario.service';
import { TicketService } from '../../services/ticket.service';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-ticket-chat',
  templateUrl: './ticket-chat.component.html',
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./ticket-chat.component.css']
})
export class TicketChatComponent implements OnInit, AfterViewChecked, OnDestroy {

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
  public destroyRef!: DestroyRef;
  public viewportScroller!: ViewportScroller;
  user: any
  identityId!: string;

  constructor(
    private usuarioService: UsuarioService,
    private location: Location,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private _ticketService: TicketService
  ) {
    this.destroyRef = inject(DestroyRef);
    this.viewportScroller = inject(ViewportScroller);
  }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    this.identityId = this.user.uid;

    this.viewportScroller.scrollToPosition([0, 0]);

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

    } else {
      this._router.navigate(['/']);
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

  goBack() {
    this.location.back();
  }
}
