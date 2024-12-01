import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any;
  covidData: any;
  qrCodeDataUrl: string = '';

  constructor(private usuarioService: UsuarioService, public route: Router, public FirebaseService: FirebaseService ) {

    this.generateQRCode('https://huzuaplicacion.web.app/registro');
   }

   ngOnInit() {
    const usuarioData = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.usuario = usuarioData; 
  }

  generateQRCode(data: string) {
    
    QRCode.toDataURL(data)
      .then((url) => {
        this.qrCodeDataUrl = url; 
      })
      .catch((error) => console.error('Error generando el QR:', error));
  }

  irConfiguracion() {
    
  }
  
  verPoliticas() {
    
  }

  irTerminos(){

    this.route.navigate(['/home/terminos']);
  }

  irMetodoPago(){

    this.route.navigate(['/home/metodopago'])

  }

  irListadoViaje(){

    this.route.navigate(['/home/listadoviaje'])

  }

  irEditarPerfil(){
    this.route.navigate(['/home/editarperfil'])
  }

  async cerrarSesion() {
    await this.FirebaseService.fireAuth.signOut();
    localStorage.removeItem('usuario');
    this.route.navigate(['/login']);
  }
  

}