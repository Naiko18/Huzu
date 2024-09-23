import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  
  private usuarios: { [rut: string]: FormGroup } = {};

  
  usuario = new FormGroup({
    nom_usuario: new FormControl('', [Validators.required, Validators.pattern("[a-z]{3,10}")]),
    contraseña: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    fec_nacimiento: new FormControl('', [Validators.required]),
    genero: new FormControl('', [Validators.required]),
    pos_vehiculo: new FormControl('', [Validators.required]),
    patente: new FormControl('', [Validators.required, Validators.pattern(/^[A-Z]{2} [A-Z]{2} \d{1,}$/)]),
    cantidad_asientos: new FormControl('', [Validators.required]),
  });

  constructor() { }

  
  agregarUsuario(nuevoUsuario: FormGroup) {
    const rut = nuevoUsuario.get('rut')?.value;
    if (this.usuarios[rut]) {
      console.log('El usuario con este RUT ya existe.');
    } else {
      this.usuarios[rut] = nuevoUsuario;
      console.log('Usuario agregado:', nuevoUsuario.value);
    }
  }

  
  modificarUsuario(rut: string, usuarioModificado: FormGroup) {
    if (this.usuarios[rut]) {
      this.usuarios[rut] = usuarioModificado;
      console.log('Usuario modificado:', usuarioModificado.value);
    } else {
      console.log('Usuario no encontrado');
    }
  }

  
  eliminarUsuario(rut: string) {
    if (this.usuarios[rut]) {
      const eliminado = this.usuarios[rut];
      delete this.usuarios[rut];
      console.log('Usuario eliminado:', eliminado.value);
    } else {
      console.log('Usuario no encontrado');
    }
  }

  obtenerUsuarios() {
    return Object.values(this.usuarios);
  }
}