import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-metodopago',
  templateUrl: './metodopago.page.html',
  styleUrls: ['./metodopago.page.scss'],
})
export class MetodopagoPage implements OnInit {

  selectedPaymentMethod: string = 'Tarjeta';

  constructor(private route: Router) { }

  ngOnInit() {
  }

  segmentChanged(event: any) {
    this.selectedPaymentMethod = event.detail.value;
  }

  isTarjetaSelected(): boolean {
    return this.selectedPaymentMethod === 'Tarjeta';
  }

  realizarPago(metodo: string) {
    console.log('Realizando pago con:', metodo);
    
  }

  volverPerfil(){

    this.route.navigate(['/home/perfil']);

  }


}
