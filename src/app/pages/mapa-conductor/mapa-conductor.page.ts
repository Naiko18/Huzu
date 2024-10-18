import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mapa-conductor',
  templateUrl: './mapa-conductor.page.html',
  styleUrls: ['./mapa-conductor.page.scss'],
})
export class MapaConductorPage implements OnInit {
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  private marker: L.Marker | undefined;
  private circle: L.Circle | undefined;
  private routingControl: any;

  latitud: number = 0;
  longitud: number = 0;
  direccion: string = '';
  direccion_inicial: string = '';
  distancia_metros: number = 0;
  tiempo_segundos: number = 0;
  
  
  tiempoMinutos: number = 0;
  costoTotal: number = 0; 
  private userLocation: L.LatLng | undefined;
  guardarDatosViaje: string[] = [];

  usuario: any;
  viaje: any;
  ruta: any;
  estado: 'pendiente' | 'en curso' | 'finalizado' | undefined;

  viajesConfirmados: any[] = [];
  middleCircle: any;

  constructor(private usuarioService: UsuarioService, private router: Router) {



  }

  ngOnInit() {
    this.initMap();
    
      this.initMap();
      
      const storedUsuario = localStorage.getItem("usuario");
      this.usuario = storedUsuario ? JSON.parse(storedUsuario) : null; 
  
      const storedViaje = localStorage.getItem("viaje");
      this.viaje = storedViaje ? JSON.parse(storedViaje) : null; 
  

  }

  initMap() {
    if (!this.map) {
      this.map = L.map('map_html');

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(this.map);

      this.map.locate({ setView: true, maxZoom: 16 });

      this.map.on('locationfound', (e: L.LocationEvent) => {
        const radius = e.accuracy / 2;

        this.userLocation = e.latlng;

        if (!this.circle) {
          this.circle = L.circle(e.latlng, {
            radius: 15, 
            color: 'black',
            fillColor: '#000000',
            fillOpacity: 0.5,
          }).addTo(this.map!);
        }

        if (!this.middleCircle) {
          this.middleCircle = L.circle(e.latlng, {
            radius: 5, 
            color: 'black', 
            fillColor: '#000000',
            fillOpacity: radius,
          }).addTo(this.map!);
        }
      });

      this.map.on('locationerror', (e) => {
        alert('No se pudo obtener la ubicación: ' + e.message);
      });
    }

    this.geocoder = G.geocoder({
      placeholder: 'Ingrese dirección a buscar',
      errorMessage: 'Dirección no encontrada',
    }).addTo(this.map);

    this.geocoder.on('markgeocode', (e: any) => {
      const latLng = e.geocode.center;
      this.latitud = latLng.lat;
      this.longitud = latLng.lng;
      this.direccion = e.geocode.name;

      if (this.map && this.userLocation) {
        if (this.routingControl) {
          this.routingControl.remove();
        }

        this.routingControl = L.Routing.control({
          waypoints: [
            this.userLocation,
            L.latLng(this.latitud, this.longitud),
          ],
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [{ color: '#000000', weight: 5 }],
            extendToWaypoints: true,
            missingRouteTolerance: 1,
          }
        })
          .on('routesfound', (e: any) => {
            const route = e.routes[0];
            
            this.distancia_metros = route.summary.totalDistance / 1000;

            this.distancia_metros = route.summary.totalDistance;

            this.tiempo_segundos = route.summary.totalTime;
            
            this.ruta = route;

            this.tiempoMinutos = Math.floor(this.tiempo_segundos / 60);

           
            this.costoTotal = Math.round(this.distancia_metros * 0.70 * 1000) / 1000;
          })
          .addTo(this.map);
      }
    });
  }

  confirmarViaje() {
    const viajeData = {
        ubicacionActual: `${this.userLocation?.lat}, ${this.userLocation?.lng}` ,
        ubicacionDestino: this.direccion,
        distancia: this.distancia_metros,
        ruta: `${this.ruta}`, 
        fecha: new Date(),
        nombreConductor: this.usuarioService.obtenerUsuarioActual, 
        asientosDisponibles: 4, 
        tiempoEstimado: this.tiempoMinutos,
        estado: 'pendiente',
        pasajeros: [],
        costoTotal: `${this.costoTotal}`,

    };

    this.usuarioService.guardarDatosViaje(viajeData);

    localStorage.setItem('viajeConfirmado', JSON.stringify(viajeData));

    this.router.navigate(['/home/viajes']);
  }



}