import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  usuario: any;

  constructor() {}

  ngOnInit(){
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
  }

}

