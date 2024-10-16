import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  private marker: L.Marker | undefined;
  private circle: L.Circle | undefined;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    
    if (!this.map) {
      this.map = L.map("map_html");

      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(this.map);

      
      this.map.locate({ setView: true, maxZoom: 16 });

      this.map.on('locationfound', (e: L.LocationEvent) => {
        const radius = e.accuracy / 2;

        
        if (!this.circle) {
          this.circle = L.circle(e.latlng, {
            radius: radius,
            color: 'black',
            fillColor: '#000000',
            fillOpacity: 0.5
          }).addTo(this.map!);
        }

        
        if (!this.marker) {
          this.marker = L.marker(e.latlng, { draggable: true }).addTo(this.map!);
        }

        
        this.map!.on('move', () => {
          const center = this.map!.getCenter(); 
          if (this.marker) {
            this.marker.setLatLng(center); 
          }
        });

        
        this.marker.on('moveend', (event) => {
          const position = (event.target as L.Marker).getLatLng();
          console.log('Nueva posición del marcador:', position);
        });
      });

      
      this.map.on('locationerror', (e) => {
        alert("No se pudo obtener la ubicación: " + e.message);
      });
    }
  }
  confirmarDestino() {
    
    console.log("Destino confirmado");
  }
}