import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaConductorRutasPageRoutingModule } from './mapa-conductor-rutas-routing.module';

import { MapaConductorRutasPage } from './mapa-conductor-rutas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaConductorRutasPageRoutingModule
  ],
  declarations: [MapaConductorRutasPage]
})
export class MapaConductorRutasPageModule {}
