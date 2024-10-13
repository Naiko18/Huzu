import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: FormGroup | undefined;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    
    const nombreUsuario = localStorage.getItem('nom_usuario'); 
    const contraseñaUsuario = localStorage.getItem('contraseña');

    if (nombreUsuario && contraseñaUsuario) {
      this.usuario = this.usuarioService.validarUsuario(nombreUsuario, contraseñaUsuario);
    }
  }

}