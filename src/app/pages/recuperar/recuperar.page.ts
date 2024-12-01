import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  correo: string | undefined;

  constructor(
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {}

  async recuperarCuenta() {
    if (this.correo) {
      try {
        localStorage.setItem('correoRecuperacion', this.correo);
        
        await this.firebaseService.recuperarContrasena(this.correo);
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un problema al enviar el correo de recuperación.',
          buttons: ['Aceptar'],
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Alerta',
        message: 'Por favor ingrese un correo válido.',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }
}