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
  private geocoder: any;
  private circle: L.Circle | undefined;
  private routingControl: any;
  private staticCircle: L.Circle | undefined;

  latitud: number = 0;
  longitud: number = 0;
  direccion: string = '';
  distancia_metros: number = 0;
  tiempo_segundos: number = 0;
  tiempoMinutos: number = 0;
  costoTotal: number = 0;

  private userLocation: L.LatLng | undefined;
  private readonly COSTO_POR_KM: number = 0.70;

  usuario: any;
  viaje: any;
  ruta: any;
  estado: 'pendiente' | 'en curso' | 'finalizado' | undefined;

  INFLATION_RATE = 0.065;  
  BASE_COSTO_POR_KM = 0.70;
  ADJUSTED_COSTO_POR_KM = this.BASE_COSTO_POR_KM * (1 + this.INFLATION_RATE);



  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit() {
    this.initMap();
    this.cargarDatosUsuario();
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


  private configurarGeocodificador() {
    this.geocoder = G.geocoder({
      placeholder: 'Ingrese dirección a buscar',
      errorMessage: 'Dirección no encontrada',
    }).addTo(this.map!);

    this.geocoder.on('markgeocode', (e: any) => {
      this.handleGeocode(e.geocode.center, e.geocode.name);
    });
  }


  private handleGeocode(latLng: L.LatLng, direccion: string) {
    this.latitud = latLng.lat;
    this.longitud = latLng.lng;
    this.direccion = direccion;

    if (this.map && this.userLocation) {
      this.generarRuta(this.userLocation, latLng);
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
    })
      .on('routesfound', (e: any) => this.calcularRuta(e.routes[0]))
      .addTo(this.map!);
  }

  private calcularRuta(route: any) {
    this.distancia_metros = route.summary.totalDistance;
    this.tiempo_segundos = route.summary.totalTime;
    this.tiempoMinutos = Math.floor(this.tiempo_segundos / 60);
    this.costoTotal = this.calcularCostoTotal(this.distancia_metros);
    this.ruta = route;
  }

 
  private calcularCostoTotal(distancia: number): number {
    const adjustedCostPerKm = this.COSTO_POR_KM * (1 + 0.065);
    return Math.round(distancia * this.COSTO_POR_KM * 1000) / 1000;
  }

 
  private cargarDatosUsuario() {
    const storedUsuario = localStorage.getItem('usuario');
    this.usuario = storedUsuario ? JSON.parse(storedUsuario) : null;

    const storedViaje = localStorage.getItem('viaje');
    this.viaje = storedViaje ? JSON.parse(storedViaje) : null;
  }

 
  confirmarViaje() {

    const ultimoId = Number(localStorage.getItem('ultimoId')) || 0;
    const nuevoId = ultimoId + 1;
    localStorage.setItem('ultimoId', nuevoId.toString());

    const viajeData = {
      id: nuevoId,
      ubicacionActual: `${this.userLocation?.lat}, ${this.userLocation?.lng}`,
      ubicacionDestino: this.direccion,
      distancia: this.distancia_metros,
      coordenadasDestino: `${this.latitud}, ${this.longitud}`,
      ruta: JSON.stringify(this.ruta),
      fecha: new Date(),
      nombreConductor: this.usuario?.nom_usuario,
      asientosDisponibles: this.usuario?.cantidad_asientos,
      tiempoEstimado: this.tiempoMinutos,
      estado: 'Pendiente',
      pasajeros: [],
      costoTotal: this.costoTotal.toFixed(2),
    };

    this.usuarioService.guardarDatosViaje(viajeData);
    localStorage.setItem('viajeConfirmado', JSON.stringify(viajeData));
    this.router.navigate(['/home/viajes']);
  }

  viajependiente(){

    


  }



}