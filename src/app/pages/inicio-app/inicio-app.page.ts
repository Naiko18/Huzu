import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GestureController } from '@ionic/angular';
import { RandomUserService } from 'src/app/services/random-user.service';

@Component({
  selector: 'app-inicio-app',
  templateUrl: './inicio-app.page.html',
  styleUrls: ['./inicio-app.page.scss'],
})
export class InicioAppPage implements AfterViewInit {  
  @ViewChild('slides', { static: false }) slides!: ElementRef;

  usuario: any;

  constructor(private gestureCtrl: GestureController, private route: Router, private randomUserService: RandomUserService) {}

  ngOnInit(){

    this.obtenerUsuario();

  }

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

  obtenerUsuario() {
    this.randomUserService.getRandomUser().subscribe({
      next: (data) => {
        this.usuario = data.results[0];  
        console.log("Usuario recibido:", this.usuario); 
      },
      error: (err) => {
        console.error('Error obteniendo usuario:', err);
      },
    });
  }




}