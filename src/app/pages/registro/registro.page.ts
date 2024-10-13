import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  alertButtons = ['Aceptar'];
  tieneVehiculo: boolean = false;

  usuario = new FormGroup({
  
    nom_usuario: new FormControl('',[Validators.required,Validators.pattern("[a-z]{3,10}")]),
    contraseña: new FormControl('',[Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]),
    rep_contraseña: new FormControl('',[Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]),
    correo: new FormControl('',[Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
    rut: new FormControl('',[Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    fec_nacimiento: new FormControl('',[Validators.required]),
    genero: new FormControl('',[Validators.required]),
    pos_vehiculo: new FormControl('',[]),
    patente: new FormControl('',[Validators.pattern(/^[A-Z]{2} [A-Z]{2} \d{1,}$/)]),  
    cantidad_asientos: new FormControl('',[]),
    mod_vehi: new FormControl('',[])  
  });

  vehiculoOptions = [
    { value: 'Sí', label: 'Sí' },
    { value: 'No', label: 'No' },
  ];

  constructor(private route: Router, private usuarioService: UsuarioService, private alertController: AlertController) {

   }

  ngOnInit() {
  }

  public usuario_registrado(): void {
    if (this.usuario.valid) {
      console.log(this.usuario.value);
     
      this.presentAlert("Te has registrado con éxito");
      this.route.navigate(['/login']);
    } else {
      
      this.presentAlert("Por favor, completa todos los campos correctamente.");
    }
  }

  private async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: message,
      buttons: this.alertButtons
    });
  
    await alert.present();
  }

  onVehiculoChange(value: string) {
    console.log('Valor seleccionado:', value);
    this.tieneVehiculo = value === 'Sí';
  }

   


}



