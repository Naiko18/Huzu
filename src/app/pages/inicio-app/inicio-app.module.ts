import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioAppPageRoutingModule } from './inicio-app-routing.module';

import { InicioAppPage } from './inicio-app.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioAppPageRoutingModule,
    
  ],
  declarations: [InicioAppPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InicioAppPageModule {}
