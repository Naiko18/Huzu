import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController } from '@ionic/angular';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function mayorDeEdadValidator(control: AbstractControl): ValidationErrors | null {
  
  const fechaNacimiento = new Date(control.value);
  const year2024 = new Date('2024-01-01');

  const edad = year2024.getFullYear() - fechaNacimiento.getFullYear();
  const diferenciaMes = year2024.getMonth() - fechaNacimiento.getMonth();
  const diferenciaDia = year2024.getDate() - fechaNacimiento.getDate();

  return edad >= 18 ? null : { menorDeEdad: true };

}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {

  usuario: FormGroup; 
  usuarios: FormGroup[] = [];
  alertButtons = ['Aceptar'];
  tieneVehiculo: boolean = false;

  vehiculoOptions = [
    { value: 'Sí', label: 'Sí' },
    { value: 'No', label: 'No' },
  ];


  constructor(private route: Router, private usuarioService: UsuarioService, private alertController: AlertController) {

    this.usuario = new FormGroup({
  
      nom_usuario: new FormControl('',[Validators.required,Validators.pattern("[a-z]{3,10}")]),
      contraseña: new FormControl('',[Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]),
      rep_contraseña: new FormControl('',[Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]),
      correo: new FormControl('',[Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
      rut: new FormControl('',[Validators.required, this.validarRut() ,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
      fec_nacimiento: new FormControl('',[Validators.required, mayorDeEdadValidator]),
      genero: new FormControl('',[Validators.required]),
      pos_vehiculo: new FormControl('',[]),
      patente: new FormControl('',[Validators.pattern(/^[A-Z]{2} [A-Z]{2} \d{1,}$/)]),  
      cantidad_asientos: new FormControl('',[]),
      mod_vehi: new FormControl('',[]),
      tip_user: new FormControl('',[])  
      },  
      { validators: this.passwordsMatchValidator('contraseña', 'rep_contraseña') });
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

  agregarUsuario() {
    if (this.usuario.valid) {
        const exito = this.usuarioService.agregarUsuario(this.usuario.value);
    } else {
        console.log('Formulario no válido:', this.usuario.errors);
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
    
    if (this.tieneVehiculo) {
      this.usuario.get('tip_user')?.setValue('Conductor');
    } else {
      this.usuario.get('tip_user')?.setValue('Pasajero');
    }
  
  }

  validarRut(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let rut = control.value;
      
      if (!rut) return null; 
      
      rut = rut.replace(/\./g, '').replace(/-/g, '');
  
      if (rut.length < 8) {
        return { rutInvalido: true };
      }
  
      const cuerpo = rut.slice(0, -1);
      const dv = rut.slice(-1).toUpperCase();
  
      if (!/^\d+$/.test(cuerpo)) {
        return { rutInvalido: true };
      }
  
      let suma = 0;
      let multiplicador = 2;
  
      for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplicador;
        multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
      }
  
      const residuo = 11 - (suma % 11);
      let dvCalculado = '';
  
      if (residuo === 11) {
        dvCalculado = '0';
      } else if (residuo === 10) {
        dvCalculado = 'K';
      } else {
        dvCalculado = residuo.toString();
      }
  
      return dv === dvCalculado ? null : { rutInvalido: true };
    };
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

}



