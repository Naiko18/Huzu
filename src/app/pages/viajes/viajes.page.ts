import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  mensajeBienvenida: string | undefined;
  usuario: any;
  animacion: 'entrar' | 'salir' = 'entrar'; 

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.mensajeBienvenida = this.getWelcomeMessage();
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');  
 
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

}