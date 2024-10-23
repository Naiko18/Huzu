import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MapaConductorPage } from '../mapa-conductor/mapa-conductor.page'; 



@Component({
  selector: 'app-viajes', 
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  mensajeBienvenida: string | undefined;
  usuario: any;
  animacion: 'entrar' | 'salir' = 'entrar'; 
  viajes: any[] = [];
  costoTotal: number = 0;
  

  constructor(private usuarioService: UsuarioService, private route: Router) { }

  ngOnInit() {
    this.cargarViajes();
    this.mensajeBienvenida = this.getWelcomeMessage();
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');  
    
    const viajesGuardados = localStorage.getItem('viajeConfirmado');
    if (viajesGuardados) {
        this.viajes = JSON.parse(viajesGuardados);
    } else {
        this.viajes = [];
    }
    
  }

  ionViewWillEnter() {
    this.cargarViajes();
  }

  cargarViajes() {
    this.viajes = this.usuarioService.obtenerDatosViajes();
  }
  

  getWelcomeMessage(): string {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 12) {
      return 'Buenos días,';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Buenas tardes,';
    } else {
      return 'Buenas noches,';
    }
  }

  animacionSalir(){
    setTimeout(() => {
      this.animacion = 'salir';
    }, 2000);
  }

  irmapaConductor(){

    this.route.navigate(['/home/mapa-conductor']);

  }

  irmapaUsuario() {
    
    this.route.navigate(['/home/mapa-pasajero']);
  
  }

  cancelarViaje(){

    this.usuarioService.eliminarViaje
    this.route.navigate(['home/viajes']);

  }

  verViaje(){

    this.route.navigate(['/home/mapa-conductor-rutas'])

  }

  


}