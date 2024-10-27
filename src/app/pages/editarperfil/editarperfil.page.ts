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
  selector: 'app-editarperfil',
  templateUrl: './editarperfil.page.html',
  styleUrls: ['./editarperfil.page.scss'],
})
export class EditarperfilPage implements OnInit {

  usuario: any; 
  usuarios: FormGroup[] = [];
  alertButtons = ['Aceptar'];
  tieneVehiculo: boolean = false;

  vehiculoOptions = [
    { value: 'Sí', label: 'Sí' },
    { value: 'No', label: 'No' },
  ];

  isEditing: boolean = false;
  editingUsuario: FormGroup | null = null;

  constructor(private route: Router, private usuarioService: UsuarioService, private alertController: AlertController) {

    this.usuario = new FormGroup({

      nom_usuario: new FormControl('', [Validators.required, Validators.pattern("[a-z]{3,10}")]),
      contraseña: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]),
      rep_contraseña: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]),
      correo: new FormControl('', [Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
      rut: new FormControl('', [Validators.required, this.validarRut(), Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
      fec_nacimiento: new FormControl('', [Validators.required, mayorDeEdadValidator]),
      genero: new FormControl('', [Validators.required]),
      pos_vehiculo: new FormControl('', []),
      patente: new FormControl('', [Validators.pattern(/^[A-Z]{2} [A-Z]{2} \d{1,}$/)]),
      cantidad_asientos: new FormControl('', []),
      mod_vehi: new FormControl('', []),
      tip_user: new FormControl('', [])
    }, { validators: this.passwordsMatchValidator('contraseña', 'rep_contraseña') });
   }

  ngOnInit() {
    this.obtenerUsuarios()
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


  obtenerUsuarios() {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      this.usuario.patchValue({
        nom_usuario: usuario.nom_usuario,
        contraseña: usuario.contraseña,
        rep_contraseña:usuario.rep_contraseña,
        correo: usuario.correo,
        rut: usuario.rut,
        fec_nacimiento: usuario.fec_nacimiento,
        genero: usuario.genero,
        pos_vehiculo: usuario.pos_vehiculo,
        patente: usuario.patente,
        cantidad_asientos: usuario.cantidad_asientos,
        mod_vehi: usuario.mod_vehi,
      });
  
      this.tieneVehiculo = usuario.pos_vehiculo === 'Sí';
    }
  }

  guardarCambios() {
    if (this.usuario.valid) {
        const usuarioActualizado = this.usuario.value;

        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

        
        const usuariosStr = localStorage.getItem('usuarios');
        const usuarios = usuariosStr ? JSON.parse(usuariosStr) : []; 

       
        const index = usuarios.findIndex((u: any) => u.rut === usuarioActualizado.rut);
        if (index !== -1) {
            usuarios.splice(index, 1); 
        }

       
        usuarios.push(usuarioActualizado);

        
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        this.presentAlert("Datos modificados con éxito");
    } else {
        this.presentAlert("Por favor, corrige los errores en el formulario.");
    }
    this.route.navigate(['/home/perfil'])
}

}
