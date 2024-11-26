import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any;
  qrCodeDataUrl: string = '';

  constructor(private usuarioService: UsuarioService, private route: Router ) {

    this.generateQRCode('http://localhost:8100/home/perfil');
   }

  ngOnInit() {

    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
  
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
  
  cerrarSesion() {
    
    localStorage.removeItem('usuario');
    this.route.navigate(['/login']);
  
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

  irqrPerfil(){

    
  }


}