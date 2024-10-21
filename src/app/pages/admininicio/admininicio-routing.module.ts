import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmininicioPage } from './admininicio.page';

const routes: Routes = [
  {
    path: '',
    component: AdmininicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmininicioPageRoutingModule {}
