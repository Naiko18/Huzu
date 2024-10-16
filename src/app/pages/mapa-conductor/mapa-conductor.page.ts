import { Component, OnInit } from '@angular/core';
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
  distancia_metros: number = 0;
  tiempo_segundos: number = 0;
  
  // Nuevas variables
  tiempoMinutos: number = 0;
  costoTotal: number = 0; 
  
  private userLocation: L.LatLng | undefined;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.initMap();
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
            radius: radius,
            color: 'black',
            fillColor: '#000000',
            fillOpacity: 0.5,
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
            this.distancia_metros = route.summary.totalDistance;
            this.tiempo_segundos = route.summary.totalTime;

            
            this.tiempoMinutos = Math.floor(this.tiempo_segundos / 60);

           
            this.costoTotal = Math.round(this.distancia_metros * 0.70 * 100) / 100;
          })
          .addTo(this.map);
      }
    });
  }
}