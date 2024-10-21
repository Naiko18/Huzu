import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmininicioPageRoutingModule } from './admininicio-routing.module';

import { AdmininicioPage } from './admininicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmininicioPageRoutingModule
  ],
  declarations: [AdmininicioPage]
})
export class AdmininicioPageModule {}
