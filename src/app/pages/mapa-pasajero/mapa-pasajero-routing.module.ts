import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaPasajeroPage } from './mapa-pasajero.page';

const routes: Routes = [
  {
    path: '',
    component: MapaPasajeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaPasajeroPageRoutingModule {}
