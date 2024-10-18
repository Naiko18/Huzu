import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GestureController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-app',
  templateUrl: './inicio-app.page.html',
  styleUrls: ['./inicio-app.page.scss'],
})
export class InicioAppPage implements AfterViewInit {  
  @ViewChild('slides', { static: false }) slides!: ElementRef;

  constructor(private gestureCtrl: GestureController, private route: Router) {}

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