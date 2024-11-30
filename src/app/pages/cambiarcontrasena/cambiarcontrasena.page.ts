import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-cambiarcontrasena',
  templateUrl: './cambiarcontrasena.page.html',
  styleUrls: ['./cambiarcontrasena.page.scss'],
})
export class CambiarcontrasenaPage implements OnInit {
  usuario: any;
  oobCode: string | null = null;  

  constructor(
    private route: ActivatedRoute, 
    private Auth: AngularFireAuth, 
    private firebaseService: FirebaseService
  ) { 
    this.usuario = new FormGroup({
      contraseña: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)
      ]),
      rep_contraseña: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)
      ])
    });
  }

  ngOnInit() {
    // Obtener el oobCode de la URL
    this.route.queryParams.subscribe(params => {
      this.oobCode = params['oobCode']; 
      if (this.oobCode) {
        this.verifyPasswordReset(this.oobCode); 
      }
    });
  }

  // Método para verificar el código y obtener el correo del usuario
  verifyPasswordReset(oobCode: string) {
    this.Auth.verifyPasswordResetCode(oobCode)
      .then(email => {
        console.log('Correo electrónico del usuario:', email);
       
      })
      .catch(error => {
        console.error('Error al verificar el código:', error);
      });
  }

  // Método para confirmar el restablecimiento de la contraseña
  resetPassword() {
    if (this.usuario.valid && this.oobCode) {
      const newPassword = this.usuario.value.contraseña;
      this.Auth.confirmPasswordReset(this.oobCode, newPassword)
        .then(() => {
          console.log('Contraseña cambiada exitosamente');
          
        })
        .catch(error => {
          console.error('Error al cambiar la contraseña:', error);
        });
    }
  }
}