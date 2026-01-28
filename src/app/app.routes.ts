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
    // {path: 'my-account', component: MyaccountComponent },
    // { path: 'my-account/ordenes', component: IndexOrdenesComponent},
    // { path: 'my-account/ordenes/detalles/:id', component: DetalleOrdenComponent},
    // {path: 'my-account/cart', component: CartCheckoutComponent },
    

    {path: '**', redirectTo: '', pathMatch: 'full'},
];
