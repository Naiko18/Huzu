import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'inicio-app',
        loadChildren: () => import('../inicio-app/inicio-app.module').then( m => m.InicioAppPageModule)
      },
      {
        path: 'viajes',
        loadChildren: () => import('../viajes/viajes.module').then( m => m.ViajesPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'administrador',
        loadChildren: () => import('../administrador/administrador.module').then( m => m.AdministradorPageModule)
      },
      {
        path: 'mapa-conductor',
        loadChildren: () => import('../mapa-conductor/mapa-conductor.module').then( m => m.MapaConductorPageModule)
      },
      {
        path: 'terminos',
        loadChildren: () => import('../terminos/terminos.module').then( m => m.TerminosPageModule)
      },
      {
        path: '',  
        redirectTo: 'inicio-app',
        pathMatch: 'full' 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
