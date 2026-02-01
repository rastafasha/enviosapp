import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario.model';
import { FileUploadService } from '../../../services/file-upload.service';
import { UsuarioService } from '../../../services/usuario.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ImagenPipe } from '../../../pipes/imagen-pipe.pipe';
import { PaisService } from '../../../services/pais.service';
import { Pais } from '../../../models/pais.model';
import { environment } from '../../../../environments/environment';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { AvisoComponent } from "../../../shared/aviso/aviso.component";
import { DriverpEditComponent } from "../../../components/driverp-edit/driverp-edit.component";

declare var jQuery:any;
declare var $:any;

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-perfil',
  imports: [
    CommonModule,
    LoadingComponent,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ImagenPipe,
    DriverpEditComponent
],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public url;
  public paises:any;
  public file !:File;
  public imgSelect !: String | ArrayBuffer;
  public data_paises : any = [];
  public msm_error = false;
  public msm_success = false;
  public pass_error = false;
  public isLoading = false;
  public isDriver = false;
  
  public user!: Usuario;
  public identity!: Usuario;
  public user_id: any;
  public userIdInicial: any;

  public pais!: Pais;

  public perfilForm!: FormGroup;
  public imagenSubir!: File;
  public imgTemp: any = null;

  option_selectedd: number = 1;
  solicitud_selectedd: any = null;


  //DATA
  public new_password = '';
  public comfirm_password = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private paisService: PaisService,
    private _router : Router,
    private _route :ActivatedRoute,
    private http: HttpClient,
    private fileUploadService: FileUploadService
  ) {
    // this.usuario = usuarioService.usuario;
    
    this.url = environment.baseUrl;

  }

  ngOnInit(): void {
    window.scrollTo(0,0);

     let USER = localStorage.getItem('user');
    if(USER){
      this.user = JSON.parse(USER);
      this.userIdInicial = this.user.uid
      this. getUser();
    }
   
  }


  getUser(){
    this.isLoading= true;
    this.usuarioService.get_user(this.userIdInicial).subscribe((resp:any)=>{
      this.identity = resp.usuario;
      this.user_id = this.identity.uid
      this.isLoading= false;
      if(this.identity.role ==='CHOFER'){
        this.isDriver = true
      }
      if(!this.identity){
        this._router.navigate(['/']);
      }

      // First initialize the form
        this.iniciarFormulario();
        
        // Then set the values
        this.perfilForm.setValue({
          uid: this.identity.uid,
          email: this.identity.email,
          first_name: this.identity.first_name,
          last_name: this.identity.last_name,
          numdoc: this.identity.numdoc,
          telefono: this.identity.telefono,
          pais: this.identity.pais,
          ciudad: this.identity.ciudad,
          google: this.identity.google,
          role: this.identity.role,
          password: '',
          img: this.identity.img,
        });
        
        this.getPaises();

     
    })
  }

  iniciarFormulario(){
    this.perfilForm = this.fb.group({
      uid: [ this.identity.uid,  Validators.required ],
      email: [ this.identity.email],
      first_name: [ '', Validators.required ],
      last_name: [ '', Validators.required ],
      numdoc: ['' ],
      telefono: [ ''],
      pais: [ ''],
      ciudad: [ ''],
      google: [ ''],
      role: [ ''],
      password: [ ''],
      img: [ ''],
    });
    
  }


  getPaises() {
    this.paisService.getPaises().subscribe(
      (resp:any) => {
        this.paises = resp;
      }
    )
  }

  close_alert(){
    this.msm_success = false;
    this.msm_error = false;
  }

  view_password(){
    let type = $('#password').attr('type');

    if(type == 'text'){
      $('#password').attr('type','password');

    }else if(type == 'password'){
      $('#password').attr('type','text');
    }
  }

  view_password2(){
    let type = $('#password_dos').attr('type');

    if(type == 'text'){
      $('#password_dos').attr('type','password');

    }else if(type == 'password'){
      $('#password_dos').attr('type','text');
    }
  }

  onUserSave(){

    this.isLoading = true;
    
        if (this.identity) {
          //actualizar
          const data = {
            ...this.perfilForm.value,
            _id: this.identity.uid,
          };
          this.usuarioService.actualizarP(data).subscribe(
            resp => {
              Swal.fire('Actualizado', `Actualizado correctamente`, 'success');
              this.isLoading = false;
              this.getUser()
            }
          );
        } else {
          //crear
          const data = {
            ...this.perfilForm.value,
          };
          this.usuarioService.crearUsuario(data)
            .subscribe((resp: any) => {
              Swal.fire('Creado', `Creado correctamente`, 'success');
              this.isLoading = false;
              this.getUser()
              // this.router.navigateByUrl(`/dashboard/producto`);
            });
        }
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

  subirImagen() {debugger
    this.isLoading = true;
        this.fileUploadService
          .actualizarFoto(this.imagenSubir, 'usuarios', this.user_id)
          .then(img => {
            this.identity.img = img;
            Swal.fire('Guardado', 'La imagen fue actualizada', 'success');
            this.isLoading = false;
            this.getUser()
          }).catch(err => {
            Swal.fire('Error', 'No se pudo subir la imagen', 'error');
            this.isLoading = false;
            this.getUser()
          })
  }

   optionSelected(value: number) {
    this.option_selectedd = value;
    if (this.option_selectedd === 1) {

      // this.ngOnInit();
    }
    if (this.option_selectedd === 2) {
      this.solicitud_selectedd = null;
    }
  }


}
