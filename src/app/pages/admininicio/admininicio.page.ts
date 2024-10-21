import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admininicio',
  templateUrl: './admininicio.page.html',
  styleUrls: ['./admininicio.page.scss'],
})
export class AdmininicioPage implements OnInit {

  constructor(private route : Router) { }

  ngOnInit() {
  }

  irCrudUsuario(){
    this.route.navigate(['/home/administrador']);
  }

  irCrudViaje(){

  }

}
