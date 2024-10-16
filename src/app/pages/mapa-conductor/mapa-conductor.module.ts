import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaConductorPageRoutingModule } from './mapa-conductor-routing.module';

import { MapaConductorPage } from './mapa-conductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaConductorPageRoutingModule
  ],
  declarations: [MapaConductorPage]
})
export class MapaConductorPageModule {}
