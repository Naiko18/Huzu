import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GestureController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-inicio-app',
  templateUrl: './inicio-app.page.html',
  styleUrls: ['./inicio-app.page.scss'],
})
export class InicioAppPage implements AfterViewInit {  
  @ViewChild('slides', { static: false }) slides!: ElementRef;

  usuario: any;

  constructor(private gestureCtrl: GestureController, private route: Router, private usuarioService: UsuarioService) {}

  ngAfterViewInit() { 
    const gesture = this.gestureCtrl.create({
      el: this.slides.nativeElement, 
      gestureName: 'slide-gesture',
      onStart: () => {
        this.slides.nativeElement.swipeEnabled = false; 
      },
      onEnd: () => {
        this.slides.nativeElement.swipeEnabled = true;
      },
    });

    gesture.enable();
  }

  comienzaViaje(){

    this.route.navigate(['/home/viajes']);

  }



}