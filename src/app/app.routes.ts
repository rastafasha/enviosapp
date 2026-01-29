import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DeliveryStatusComponent } from './pages/delivery-status/delivery-status.component';
import { DriverHomeComponent } from './pages/driver-home/driver-home.component';
import { MapaComponent } from './pages/mapa/mapa.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { MisEntregasComponent } from './pages/mis-entregas/mis-entregas.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { PerfilComponent } from './pages/profile/perfil/perfil.component';
import { DireccionEditComponent } from './pages/profile/direcciones/direccion-edit/direccion-edit.component';
import { Paso2Component } from './pages/pasos/paso2/paso2.component';
import { Paso3Component } from './pages/pasos/paso3/paso3.component';
import { Paso4Component } from './pages/pasos/paso4/paso4.component';



export const routes: Routes = [
    // {path: '', component: LoginComponent},
    
    {path: '', component: DriverHomeComponent},// home del driver
    {path: 'home', component: DriverHomeComponent},// home del driver
    {path: 'home-customer', component: HomeComponent}, // home usuarios
    {path: 'delivery-home', component: DriverHomeComponent},
    {path: 'delivery-status', component: DeliveryStatusComponent},
    {path: 'mapa-page', component: MapaComponent},
    {path: 'mapa-page/:id', component: MapaComponent},
    {path: 'order-detail/:id', component: OrderDetailComponent},
    {path: 'mis-entregas', component: MisEntregasComponent},
    
   
     {
        path:'login',
        component: LoginComponent
    },
    {
        path:'registro',
        component: RegisterComponent
    },
    {path: 'recovery-password', component: RecoveryComponent },

    {path: 'myprofile', component: ProfileComponent},
    {path: 'myprofile/:id', component: PerfilComponent },
    {path: 'myprofile/direccion/create', component: DireccionEditComponent },
    {path: 'myprofile/direccion/edit/:id', component: DireccionEditComponent },

    {path: 'delivery/paso1/', component: HomeComponent },
    {path: 'delivery/paso2/:id', component: Paso2Component },
    {path: 'delivery/paso3/:id', component: Paso3Component },
    {path: 'delivery/paso4/:id', component: Paso4Component },
    

    {path: '**', redirectTo: '', pathMatch: 'full'},
];
