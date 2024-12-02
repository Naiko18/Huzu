import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

export function mayorDeEdadValidator(control: AbstractControl): ValidationErrors | null {
  const fechaNacimiento = new Date(control.value);
  const year2024 = new Date('2024-01-01');

  const edad = year2024.getFullYear() - fechaNacimiento.getFullYear();
  const diferenciaMes = year2024.getMonth() - fechaNacimiento.getMonth();
  const diferenciaDia = year2024.getDate() - fechaNacimiento.getDate();

  return edad >= 18 ? null : { menorDeEdad: true };

}

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  usuario: FormGroup; 
  usuarios: FormGroup<any>[] = []; 
  showAlert = false;
  tieneVehiculo: boolean = false;
  isEditing: boolean = false;
  editingUsuario: FormGroup | null = null;

  constructor(private usuarioService: UsuarioService, private firebaseService: FirebaseService) { 
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
      tip_user: new FormControl('',[Validators.required])
    },  
    { validators: this.passwordsMatchValidator('contraseña', 'rep_contraseña') });
  }

  ngOnInit() {
    this.obtenerUsuarios(); 
  }

  agregarUsuario() {
    if (this.usuario.valid) {
      this.firebaseService.crearUsuario(this.usuario.value).then(exito => {
        if (exito) {
          this.obtenerUsuarios();
          this.resetForm();
        } else {
          console.log('El usuario ya existe.');
        }
      }).catch(error => {
        console.log('Error al agregar usuario:', error);
      });
    } else {
      console.log('Formulario no válido:', this.usuario.errors);
    }
  }

  deleteUsuario(rut: string) {
    this.firebaseService.deleteUsuario(rut).then(() => {
      console.log('Usuario eliminado:', rut);
      this.obtenerUsuarios();
    }).catch(error => {
      console.log('Error al eliminar usuario:', error);
    });
  }
 
  editUsuario(usuario: FormGroup) {
    this.editingUsuario = usuario;
    this.isEditing = true;
  
    this.usuario.patchValue({
      nom_usuario: usuario.get('nom_usuario')?.value,
      contraseña: usuario.get('contraseña')?.value,
      rep_contraseña: usuario.get('rep_contraseña')?.value, // Agregado
      correo: usuario.get('correo')?.value,
      rut: usuario.get('rut')?.value,
      fec_nacimiento: usuario.get('fec_nacimiento')?.value,
      genero: usuario.get('genero')?.value,
      pos_vehiculo: usuario.get('pos_vehiculo')?.value,
      patente: usuario.get('patente')?.value,
      cantidad_asientos: usuario.get('cantidad_asientos')?.value,
      mod_vehi: usuario.get('mod_vehi')?.value, // Agregado
      tip_user: usuario.get('tip_user')?.value // Agregado
    });
  }
  
  confirmEdit() {
    if (this.usuario.valid) {
      console.log('Datos a actualizar:', this.usuario.value);
      this.firebaseService.updateUsuario(this.usuario.value).then(() => {
        console.log('Usuario actualizado exitosamente.');
        this.isEditing = false;
        this.editingUsuario = null;
        this.resetForm();
        this.obtenerUsuarios();
      }).catch(error => {
        console.log('Error al editar usuario:', error);
      });
    } else {
      console.log('El formulario no es válido:', this.usuario.errors);
    }
  }

  onVehiculoChange(value: string) {
    this.tieneVehiculo = value === 'Sí';
  }

  vehiculoOptions = [
    { value: 'Sí', label: 'Sí' },
    { value: 'No', label: 'No' },
  ];

  resetForm() {
    this.usuario.reset();
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
    this.firebaseService.getUsuarios().subscribe(usuarios => {
      
      this.usuarios = usuarios.map(usuario => this.crearFormulario(usuario));
    }, error => {
      console.log('Error al obtener usuarios:', error);
    });
  }
  
  crearFormulario(usuario: any): FormGroup {
    return new FormGroup({
      nom_usuario: new FormControl(usuario.nom_usuario),
      contraseña: new FormControl(usuario.contraseña),
      rep_contraseña: new FormControl(usuario.rep_contraseña),
      correo: new FormControl(usuario.correo),
      rut: new FormControl(usuario.rut),
      fec_nacimiento: new FormControl(usuario.fec_nacimiento),
      genero: new FormControl(usuario.genero),
      pos_vehiculo: new FormControl(usuario.pos_vehiculo),
      patente: new FormControl(usuario.patente),
      cantidad_asientos: new FormControl(usuario.cantidad_asientos),
      mod_vehi: new FormControl(usuario.mod_vehi),
      tip_user: new FormControl(usuario.tip_user)
    });
  }


}