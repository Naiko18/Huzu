import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoviajePage } from './listadoviaje.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoviajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoviajePageRoutingModule {}
