import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  nombre_user: string = '';
  contra_user: string = '';

  constructor(private route: Router, private usuarioService: UsuarioService) {}

  ngOnInit() {}

  ingresarLogin() {
    
    const usuarioValido = this.usuarioService.validarUsuario(this.nombre_user, this.contra_user);

    if (usuarioValido) {
      
      localStorage.setItem('usuario', JSON.stringify(usuarioValido.value));

      this.route.navigate(['/home/inicio-app']);
    } else {
      console.log('Contraseña o usuario incorrectos');
    }
  }
}