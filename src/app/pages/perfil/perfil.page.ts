import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  verMas() {
    console.log('Ver más detalles del usuario');
    // Aquí puedes añadir la navegación o mostrar más información
  }
}
