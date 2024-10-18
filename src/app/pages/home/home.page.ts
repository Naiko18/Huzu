import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario: any;

  constructor() {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
  }

  
  onTabChange(event: any) {
    const tabButtons = document.querySelectorAll('ion-tab-button');
    tabButtons.forEach((tabButton: any) => {
      tabButton.classList.remove('tab-selected');
    });
    event.target.classList.add('tab-selected');
  }
}
