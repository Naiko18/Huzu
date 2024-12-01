import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-listadoviaje',
  templateUrl: './listadoviaje.page.html',
  styleUrls: ['./listadoviaje.page.scss'],
})
export class ListadoviajePage implements OnInit {
  
  viajes: any[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.cargarViajesFinalizados();
  }

  cargarViajesFinalizados() {
    this.firebaseService.obtenerDatosViajes().subscribe(viajes => {
      // Filtrar los viajes finalizados
      this.viajes = viajes.filter((viaje: any) => viaje.estado === 'Finalizado');
    });
  }
}