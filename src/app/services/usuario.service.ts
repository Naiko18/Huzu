import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface Usuario {
  nom_usuario: string;
  contraseña: string;
  rep_contraseña: string;
  correo: string;
  rut: string;
  fec_nacimiento: string;
  genero: string;
  pos_vehiculo?: string;
  patente?: string; 
  cantidad_asientos?: number; 
  mod_vehi?: string;
  tip_user?: string; 
}

export function mayorDeEdadValidator(control: AbstractControl): ValidationErrors | null {
  const fechaNacimiento = new Date(control.value);
  const year2024 = new Date('2024-01-01');

  const edad = year2024.getFullYear() - fechaNacimiento.getFullYear();
  const diferenciaMes = year2024.getMonth() - fechaNacimiento.getMonth();
  const diferenciaDia = year2024.getDate() - fechaNacimiento.getDate();

  return edad >= 18 ? null : { menorDeEdad: true };

}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public usuarios: { [rut: string]: FormGroup } = {};

  constructor() {

    this.agregarUsuario({
      nom_usuario: 'benjamin',
      contraseña: 'Benjamin@123',
      rep_contraseña: 'Benjamin@123',
      correo: 'benjamin@duocuc.cl',
      rut: '12345678-9',
      fec_nacimiento: '2004-09-26',
      genero: 'Masculino',
      pos_vehiculo: 'Sí',
      patente: 'AB CD 12',
      cantidad_asientos: 4,
      mod_vehi: 'Ford Explorer 2024',
      tip_user: 'Conductor'
    });

    this.agregarUsuario({
      nom_usuario: 'admin',
      contraseña: 'Admin@123',
      rep_contraseña: 'Admin@123',
      correo: 'admin@duocuc.cl',
      rut: '98765432-1',
      fec_nacimiento: '2000-01-01',
      genero: 'Otro',
      tip_user: 'Administrador'
    });

    this.agregarUsuario({
      nom_usuario: 'nicolas',
      contraseña: 'Nicolas@123',
      rep_contraseña: 'Nicolas@123',
      correo: 'nico@duocuc.cl',
      rut: '11223344-5',
      fec_nacimiento: '2003-10-10',
      genero: 'Masculino',
      tip_user: 'Pasajero'
    });


   }

  agregarUsuario(nuevoUsuario: Usuario): boolean {
    const rut = nuevoUsuario.rut;

    if (this.usuarios[rut]) {
      console.log('El usuario con este RUT ya existe.');
      return false;
    } else {
      const formGroupUsuario = new FormGroup({
        nom_usuario: new FormControl(nuevoUsuario.nom_usuario, [Validators.required, Validators.pattern("[a-z]{3,10}")]),
        contraseña: new FormControl(nuevoUsuario.contraseña, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]),
        rep_contraseña: new FormControl(nuevoUsuario.rep_contraseña, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]),
        correo: new FormControl(nuevoUsuario.correo, [Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
        rut: new FormControl(nuevoUsuario.rut, [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
        fec_nacimiento: new FormControl(nuevoUsuario.fec_nacimiento, [Validators.required, mayorDeEdadValidator]),
        genero: new FormControl(nuevoUsuario.genero, [Validators.required]),
        pos_vehiculo: new FormControl(nuevoUsuario.pos_vehiculo, []),
        patente: new FormControl(nuevoUsuario.patente, [Validators.pattern(/^[A-Z]{2} [A-Z]{2} \d{1,}$/)]),
        cantidad_asientos: new FormControl(nuevoUsuario.cantidad_asientos),
        mod_vehi: new FormControl(nuevoUsuario.mod_vehi),
        tip_user: new FormControl(nuevoUsuario.tip_user)
      });

      this.usuarios[rut] = formGroupUsuario;
      console.log('Usuario agregado:', formGroupUsuario.value);
      return true;
    }

  }

  modificarUsuario(rut: string, usuarioModificado: FormGroup): void {
    if (this.usuarios[rut]) {
      this.usuarios[rut] = usuarioModificado;
      console.log('Usuario modificado:', usuarioModificado.value);
    } else {
      console.log('Usuario no encontrado');
    }
  }

  eliminarUsuario(rut: string): boolean {
    if (this.usuarios[rut]) {
      delete this.usuarios[rut];
      console.log('Usuario eliminado:', rut);
      return true;
    } else {
      console.log('Usuario no encontrado para eliminar:', rut);
      return false;
    }
  }

  obtenerUsuarios(): FormGroup[] {
    return Object.values(this.usuarios);
  }

  public validarUsuario(nombre: string, contraseña: string): FormGroup | undefined {
    return Object.values(this.usuarios).find(usuario =>
      usuario.get('nom_usuario')?.value === nombre && usuario.get('contraseña')?.value === contraseña
    );
  }

  
}