import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public usuarios: { [rut: string]: FormGroup } = {};

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

  agregarUsuario(nuevoUsuario: any): boolean {
    const rut = nuevoUsuario.rut;
    
    if (this.usuarios[rut]) {
        console.log('El usuario con este RUT ya existe.');
        return false;
    } else {
        
        this.usuarios[rut] = new FormGroup({
            nom_usuario: new FormControl(nuevoUsuario.nom_usuario, [Validators.required, Validators.pattern("[a-z]{3,10}")]),
            contraseña: new FormControl(nuevoUsuario.contraseña, [Validators.required]),
            correo: new FormControl(nuevoUsuario.correo, [Validators.required, Validators.email]),
            rut: new FormControl(nuevoUsuario.rut, [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
            fec_nacimiento: new FormControl(nuevoUsuario.fec_nacimiento, [Validators.required]),
            genero: new FormControl(nuevoUsuario.genero, [Validators.required]),
            pos_vehiculo: new FormControl(nuevoUsuario.pos_vehiculo, [Validators.required]),
            patente: new FormControl(nuevoUsuario.patente, [Validators.required, Validators.pattern(/^[A-Z]{2} [A-Z]{2} \d{1,}$/)]),
            cantidad_asientos: new FormControl(nuevoUsuario.cantidad_asientos, [Validators.required]),
        });
        
        console.log('Usuario agregado:', nuevoUsuario);
        return true;
    }
    this.usuarios[rut] = nuevoUsuario;
    console.log('El usuario ha sido creado:', nuevoUsuario.value);
    return true;
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
    console.log(this.usuario.value)
    return Object.values(this.usuarios);
    
  }
}