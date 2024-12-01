import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mapa-pasajero',
  templateUrl: './mapa-pasajero.page.html',
  styleUrls: ['./mapa-pasajero.page.scss'],
})
export class MapaPasajeroPage implements OnInit {
  private map: L.Map | undefined;
  private geocoder: any;
  private circle: L.Circle | undefined;
  private routingControl: any;
  private staticCircle: L.Circle | undefined;
  private userLocation: L.LatLng | undefined;
  viaje: any;

  latitud: number = 0;
  longitud: number = 0;
  direccion: string = '';
  asientosDisponiblesTemp: number | undefined;

  constructor(private usuarioService: UsuarioService, private route: Router) { }

  ngOnInit() {
    this.initMap(); 

    const viajeGuardado = localStorage.getItem('viajeConfirmado');
      if (viajeGuardado) {
        this.viaje = JSON.parse(viajeGuardado); 
        this.asientosDisponiblesTemp = this.viaje.asientosDisponibles;
      }
    
    setTimeout(() => {
      this.cargarRutaGuardada();
    }, 500); 
    
  }

  private initMap() {
    if (!this.map) {
      this.map = L.map('map_html');
      this.configurarTileLayer();
      this.obtenerUbicacionUsuario();
    }
    this.configurarGeocodificador();
  }

  private configurarTileLayer() {
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(this.map!);
  }

  private obtenerUbicacionUsuario() {
    this.map?.locate({ setView: true, maxZoom: 16 });
    this.map?.on('locationfound', (e: L.LocationEvent) => {
      this.userLocation = e.latlng;
      this.agregarCirculos(e.latlng);
    });
    this.map?.on('locationerror', (e) => {
      alert('No se pudo obtener la ubicación: ' + e.message);
    });
  }

  private agregarCirculos(latlng: L.LatLng) {
    if (!this.circle) {
      this.circle = L.circle(latlng, {
        radius: 15,
        color: 'black',
        fillColor: '#000000',
        fillOpacity: 0.5,
      }).addTo(this.map!);
    }
    if (!this.staticCircle) {
      this.staticCircle = L.circle(latlng, {
        radius: 5,
        color: 'black',
        fillColor: '#000000',
        fillOpacity: 1,
      }).addTo(this.map!);
    }
  }

  private generarRuta(origen: L.LatLng, destino: L.LatLng) {
    if (this.routingControl) {
      this.routingControl.remove();
    }

    this.routingControl = L.Routing.control({
      waypoints: [origen, destino],
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#000000', weight: 5 }],
        extendToWaypoints: true,
        missingRouteTolerance: 1,
      },
    }).addTo(this.map!);
  }

  private handleGeocode(latLng: L.LatLng, direccion: string) {
    this.latitud = latLng.lat;
    this.longitud = latLng.lng;
    this.direccion = direccion;

    if (this.map && this.userLocation) {
      this.generarRuta(this.userLocation, latLng);
    }
  }

  private configurarGeocodificador() {
    this.geocoder = G.geocoder({
      placeholder: 'Ingrese dirección a buscar',
      errorMessage: 'Dirección no encontrada',
    }).addTo(this.map!);

    this.geocoder.on('markgeocode', (e: any) => {
      this.handleGeocode(e.geocode.center, e.geocode.name);
    });
  }

  private cargarRutaGuardada() {
    const viajeGuardado = localStorage.getItem('viajeConfirmado');
    if (viajeGuardado) {
      const viajeData = JSON.parse(viajeGuardado);
      
      const [latActual, lngActual] = viajeData.ubicacionActual.split(', ').map(Number);
      
      this.userLocation = L.latLng(latActual, lngActual);
      
      const [latDestino, lngDestino] = viajeData.coordenadasDestino.split(', ').map(Number);
      
      if (this.userLocation) {
        this.generarRuta(this.userLocation, L.latLng(latDestino, lngDestino));
        this.map?.invalidateSize();
      }
    }
  }
 
  public reservarAsiento() {
    if (this.viaje && this.viaje.id && this.asientosDisponiblesTemp && this.asientosDisponiblesTemp > 0) {
      this.asientosDisponiblesTemp--; 
  
      this.viaje.asientosDisponibles = this.asientosDisponiblesTemp;
  
      const viajesGuardados = JSON.parse(localStorage.getItem('viajes') || '[]');
      const viajeActualizado = viajesGuardados.map((viaje: any) => {
        return viaje.id === this.viaje.id ? this.viaje : viaje; 
      });
      localStorage.setItem('viajes', JSON.stringify(viajeActualizado));
    }
  }

  VolverViajes(){
    localStorage.removeItem('viajeConfirmado');
    this.route.navigate(['/home/viajes']);
  }

}