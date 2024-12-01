import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiarcontrasena',
  templateUrl: './cambiarcontrasena.page.html',
  styleUrls: ['./cambiarcontrasena.page.scss'],
})
export class CambiarcontrasenaPage implements OnInit {
  usuario!: FormGroup;
  loading = false;
  correo: string | null = '';
 
  constructor(
    private auth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private router: Router
  ) {
    this.usuario = new FormGroup(
      {
        contraseña: new FormControl('', [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/),
        ]),
        rep_contraseña: new FormControl('', [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/),
        ]),
      },
      { validators: this.passwordsMatchValidator('contraseña', 'rep_contraseña') }
    );
  }

  ngOnInit() {
    // Recuperar el correo desde localStorage
    this.correo = localStorage.getItem('correoRecuperacion');
  }

  passwordsMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordsMismatch: true });
        return { passwordsMismatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  async cambiarContrasena() {
    if (this.usuario.valid && this.correo) {
      const nuevaContrasena = this.usuario.get('contraseña')?.value;

      try {
        this.loading = true;

        // Actualizar contraseña en Firestore directamente basado en el correo
        await this.firebaseService.actualizarContrasenaFirestore(this.correo, nuevaContrasena);

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'La contraseña ha sido actualizada correctamente.',
          buttons: ['Aceptar'],
        });
        await alert.present();

        // Redirigir al usuario a la página de inicio de sesión
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al actualizar la contraseña. Intente nuevamente.',
          buttons: ['Aceptar'],
        });
        await alert.present();
      } finally {
        this.loading = false;
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Alerta',
        message: 'Asegúrese de que las contraseñas coincidan y sean válidas.',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }
}