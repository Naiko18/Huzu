import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaConductorRutasPage } from './mapa-conductor-rutas.page';

const routes: Routes = [
  {
    path: '',
    component: MapaConductorRutasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaConductorRutasPageRoutingModule {}
