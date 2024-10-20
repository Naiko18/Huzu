import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  correo: string | undefined;

  constructor(private alertController: AlertController, private usuarioService: UsuarioService) {}

  ngOnInit() {}

  async recuperarCuenta() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((user: any) => user.correo === this.correo);

    if (usuario) {
      
      const alert = await this.alertController.create({
        header: 'Alerta',
        message: 'Se ha enviado un enlace para recuperar su cuenta a su correo',
        buttons: ['Aceptar'],
      });
      await alert.present();
    } else {
      
      const alert = await this.alertController.create({
        header: 'Alerta',
        message: 'Por favor ingrese un correo válido',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }
}