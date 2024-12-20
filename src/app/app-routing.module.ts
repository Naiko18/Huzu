import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  {
    path: 'viajes',
    loadChildren: () => import('./pages/viajes/viajes.module').then( m => m.ViajesPageModule),
    
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    
  },
  {
    path: 'administrador',
    loadChildren: () => import('./pages/administrador/administrador.module').then( m => m.AdministradorPageModule),
    
  },
  {
    path: 'mapa-conductor',
    loadChildren: () => import('./pages/mapa-conductor/mapa-conductor.module').then( m => m.MapaConductorPageModule)
  },
  {
    path: 'inicio-app',
    loadChildren: () => import('./pages/inicio-app/inicio-app.module').then( m => m.InicioAppPageModule)
  },
  {
    path: 'terminos',
    loadChildren: () => import('./pages/terminos/terminos.module').then( m => m.TerminosPageModule)
  },
  {
    path: 'mapa-pasajero',
    loadChildren: () => import('./pages/mapa-pasajero/mapa-pasajero.module').then( m => m.MapaPasajeroPageModule)
  },
  {
    path: 'listadoviaje',
    loadChildren: () => import('./pages/listadoviaje/listadoviaje.module').then( m => m.ListadoviajePageModule)
  },
  {
    path: 'metodopago',
    loadChildren: () => import('./pages/metodopago/metodopago.module').then( m => m.MetodopagoPageModule)
  },
  {
    path: 'admininicio',
    loadChildren: () => import('./pages/admininicio/admininicio.module').then( m => m.AdmininicioPageModule)
  },
  {
    path: 'mapa-conductor-rutas',
    loadChildren: () => import('./pages/mapa-conductor-rutas/mapa-conductor-rutas.module').then( m => m.MapaConductorRutasPageModule)
  },
  {
    path: 'editarperfil',
    loadChildren: () => import('./pages/editarperfil/editarperfil.module').then( m => m.EditarperfilPageModule)
  },
  {
    path: 'consumoapi',
    loadChildren: () => import('./pages/consumoapi/consumoapi.module').then( m => m.ConsumoapiPageModule)
  },
  {
    path: 'cambiarcontrasena',
    loadChildren: () => import('./pages/cambiarcontrasena/cambiarcontrasena.module').then( m => m.CambiarcontrasenaPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/error404/error404.module').then( m => m.Error404PageModule)
  }





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
