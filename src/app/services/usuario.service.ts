import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public usuarios: { [rut: string]: FormGroup } = {};

  constructor() { }

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
        fec_nacimiento: new FormControl(nuevoUsuario.fec_nacimiento, [Validators.required]),
        genero: new FormControl(nuevoUsuario.genero, [Validators.required]),
        pos_vehiculo: new FormControl(nuevoUsuario.pos_vehiculo, []),
        patente: new FormControl(nuevoUsuario.patente, [Validators.pattern(/^[A-Z]{2} [A-Z]{2} \d{1,}$/)]),
        cantidad_asientos: new FormControl(nuevoUsuario.cantidad_asientos),
        mod_vehi: new FormControl(nuevoUsuario.mod_vehi)
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