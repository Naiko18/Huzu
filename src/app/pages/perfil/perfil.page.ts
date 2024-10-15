import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any;

  constructor(private usuarioService: UsuarioService, private route: Router) { }

  ngOnInit() {

    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
  
  }

  irConfiguracion() {
    
  }
  
  verPoliticas() {
    
  }
  
  cerrarSesion() {
    
    this.usuarioService.eliminarUsuario
    this.route.navigate(['/login']);
  }



}