import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoviajePageRoutingModule } from './listadoviaje-routing.module';

import { ListadoviajePage } from './listadoviaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoviajePageRoutingModule
  ],
  declarations: [ListadoviajePage]
})
export class ListadoviajePageModule {}
