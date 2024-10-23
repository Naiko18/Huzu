import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listadoviaje',
  templateUrl: './listadoviaje.page.html',
  styleUrls: ['./listadoviaje.page.scss'],
})
export class ListadoviajePage implements OnInit {
  
  viajes: any[] = [];

  constructor() {}

  ngOnInit() {
    const viajeGuardado = localStorage.getItem('viajeConfirmado');
    if (viajeGuardado) {
      const viaje = JSON.parse(viajeGuardado);
      if (viaje.estado === 'Finalizado') {
        this.viajes = [viaje]; 
      }
    }
  }
}