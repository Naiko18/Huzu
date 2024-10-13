import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {
  
  mensajeBienvenida: string | undefined;

  
  constructor() { }

  ngOnInit() {
    this.mensajeBienvenida = this.getWelcomeMessage();  
  }

  getWelcomeMessage(): string {
    const currentHour = new Date().getHours(); 
  
    if (currentHour >= 6 && currentHour < 12) {
      return 'Buenos días';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }

  tomarViaje(viajeId: number) {
    
    console.log(`Viaje ${viajeId} tomado`);
  }

}