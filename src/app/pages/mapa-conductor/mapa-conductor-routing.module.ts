import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaConductorPage } from './mapa-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: MapaConductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaConductorPageRoutingModule {}
