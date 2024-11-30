import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  nombre_user: string = '';
  contra_user: string = '';
  alertButtons = ['Aceptar'];
  correo: string = '';

  constructor(
    private route: Router, 
    private usuarioService: UsuarioService, 
    private alertController: AlertController,
    private firebaseService: FirebaseService,
    private loadingController: LoadingController, 
    private http: HttpClient
  ) {}

  ngOnInit() {}

  async login() {
    
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.correo, this.contra_user)
      .then((userCredential) => {
        // Autenticación exitosa
        const user = userCredential.user;
        const uid = user.uid; // Obtener el UID del usuario
        console.log('Usuario autenticado con UID:', uid);

        // Usar el servicio FireService para obtener los datos del usuario
        this.firebaseService
          .getUsuarioUid(uid)
          .then((userData) => {
            if (userData) {
              console.log('Datos del usuario:', userData);

              // Guardar el objeto del usuario en el localStorage
              localStorage.setItem('usuario', JSON.stringify(userData));

              // Redirigir al usuario a la página principal
              this.route.navigate(['/home']);
            } else {
              console.error('El documento del usuario no existe en la base de datos.');
            }
          })
          .catch((error) => {
            console.error('Error al obtener los datos del usuario:', error);
          })
          .finally(() => {
            loading.dismiss(); // Ocultar el ion-loading
          });
      })
      .catch((error) => {
        console.error('Error durante el inicio de sesión:', error);
        console.error('Código de error:', error.code);
        console.error('Mensaje del error:', error.message);
        loading.dismiss(); // Ocultar el ion-loading en caso de error
        this.presentAlert('Usuario y/o Contraseña incorrectos');
      });
  }

  
  private async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: this.alertButtons
    });

    await alert.present();
  }

  async mostrarLoadingConHttp() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'crescent',
    });
  
    await loading.present();
  
    this.http.get('https://api.example.com/data').subscribe({
      next: (data) => {
        console.log(data);
        loading.dismiss();
      },
      error: (error) => {
        console.error(error);
        loading.dismiss();
      }
    });
  }


}