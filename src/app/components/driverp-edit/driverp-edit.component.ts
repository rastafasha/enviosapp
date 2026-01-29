import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Driver } from '../../models/driverp.model';
import { Usuario } from '../../models/usuario.model';
import { DriverpService } from '../../services/driverp.service';
import { FileUploadService } from '../../services/file-upload.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';
import { environment } from '../../../environments/environment';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TipoVehiculo } from '../../models/tipovehiculo.model';
import { TipovehiculoService } from '../../services/tipovehiculo.service';
declare var jQuery: any;
declare var $: any;

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-driverp-edit',
  imports: [
    CommonModule,
    LoadingComponent,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ImagenPipe,
  ],
  templateUrl: './driverp-edit.component.html',
  styleUrls: ['./driverp-edit.component.css']
})
export class DriverpEditComponent implements OnInit {

  @Input() identity!: Usuario;

  public driverProfileForm!: FormGroup;
  public usuario!: Usuario;
  public driver!: Driver;
  public driverSeleccionado: any;
  public imagenSubir!: File;
  public imgTemp: any = null;
  uid!: string;
  pageTitle!: string;


  public url;
  public paises: any;
  public file !: File;
  public imgSelect !: String | ArrayBuffer;
  public data_paises: any = [];
  public msm_error = false;
  public msm_success = false;
  public pass_error = false;
  public isLoading = false;
  public isDriver = false;

  public user!: Usuario;
  public user_id: any;
  public driver_id!: string;

  public driverForm!: FormGroup;

  option_selectedd: number = 1;
  solicitud_selectedd: any = null;

  tipos!: TipoVehiculo[] | null;


  //DATA
  public new_password = '';
  public comfirm_password = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private tiposvhService: TipovehiculoService,
    private driverService: DriverpService,
    private fileUploadService: FileUploadService
  ) {
    // this.usuario = usuarioService.usuario;

    this.url = environment.baseUrl;

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.identity;
    this.user_id = this.identity.uid;
    this.user_id = this.identity.uid;
    console.log(this.identity)
    this.getDriver();
    this.getTipoVehiculo();
    this.iniciarFormulario();

  }

  getDriver() {
    this.driverService.getByUserId(this.user_id).subscribe((resp: any) => {
      this.driver = resp;
      this.driver_id = resp._id;

      if(this.driver){
        this.driverForm.setValue({
          marca: this.driver.marca,
          modelo: this.driver.modelo,
          color: this.driver.color,
          year: this.driver.year,
          tipo_vehiculo: this.driver.tipo_vehiculo,
          placa: this.driver.placa,
          licencianum: this.driver.licencianum,
          status: this.driver.status,
          user: this.driver.user,
          img: this.driver.img,
        });
      }
      
    })
  }

  getTipoVehiculo(){
    this.tiposvhService.getTiposVehics().subscribe((resp:any)=>{
      this.tipos = resp;
    })
  }



  iniciarFormulario() {
    this.driverForm = this.fb.group({
      marca: ['', Validators.required],
      tipo_vehiculo: ['', Validators.required],
      placa: ['', Validators.required],
      color: ['', Validators.required],
      year: ['', Validators.required],
      modelo: ['', Validators.required],
      licencianum: ['', Validators.required],
      user: [this.user_id ],
      status: ['PENDING'],
      img: [''],
    });

  }



  close_alert() {
    this.msm_success = false;
    this.msm_error = false;
  }


  onUserSave() {
    this.isLoading = true;

    if (this.driver) {
      //actualizar
      const data = {
        ...this.driverForm.value,
        _id: this.driver._id,
      };
      this.driverService.actualizar(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `Actualizado correctamente`, 'success');
          this.isLoading = false;
          this.getDriver()
        }
      );
    } else {
      //crear
      const data = {
        ...this.driverForm.value,
      };
      this.driverService.create(data)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `Creado correctamente`, 'success');
          this.isLoading = false;
          this.getDriver()
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

  subirImagen() {
    this.isLoading = true;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'drivers', this.driver_id)
      .then(img => {
        this.driver.img = img;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');
        this.isLoading = false;
        this.getDriver()
      }).catch(err => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        this.isLoading = false;
        this.getDriver()
      })
  }


}
