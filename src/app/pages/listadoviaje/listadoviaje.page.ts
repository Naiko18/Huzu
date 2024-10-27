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
    this.cargarViajesFinalizados();
  }

  cargarViajesFinalizados() {
    const viajesGuardados = localStorage.getItem('viajes');

    if (viajesGuardados) {
      
      const viajeParsed = JSON.parse(viajesGuardados);
      this.viajes = Array.isArray(viajeParsed) ? viajeParsed : [viajeParsed];

     
      this.viajes = this.viajes.filter((viaje: any) => viaje.estado === 'Finalizado');
    } else {
      this.viajes = [];
    }
  }
}