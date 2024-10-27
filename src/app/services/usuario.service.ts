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

export interface Viaje {
  id: number; 
  ubicacionActual: string;
  ubicacionDestino: { nombre: string; coordenadas: { lat: number; lng: number } };
  distancia: number; 
  ruta: string; 
  fecha: Date;
  nombreConductor: string; 
  asientosDisponibles: number; 
  tiempoEstimado: number; 
  estado: 'Pendiente' | 'En curso' | 'Finalizado'; 
  pasajeros: string[]; 

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
    this.cargarUsuariosDesdeLocalStorage();
    this.crearUsuarioPredeterminado();
  }

  private crearUsuarioPredeterminado(): void {
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
  }

  agregarUsuario(nuevoUsuario: Usuario): boolean {
    const rut = nuevoUsuario.rut;

    if (this.usuarios[rut]) {
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
      this.guardarUsuariosEnLocalStorage(); 
      //console.log('Usuario agregado:', formGroupUsuario.value);
      return true;
    }
  }

  modificarUsuario(rut: string, usuarioModificado: FormGroup): void {
    if (this.usuarios[rut]) {
      this.usuarios[rut] = usuarioModificado;
      this.guardarUsuariosEnLocalStorage(); 
      //console.log('Usuario modificado:', usuarioModificado.value);
    } // else {
      // console.log('Usuario no encontrado');
      //}
  }

  eliminarUsuario(rut: string): boolean {
    if (this.usuarios[rut]) {
      delete this.usuarios[rut];
      this.guardarUsuariosEnLocalStorage(); 
      //console.log('Usuario eliminado:', rut);
      return true;
    } else {
      //console.log('Usuario no encontrado para eliminar:', rut);
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

  private guardarUsuariosEnLocalStorage(): void {
    const usuariosArray = Object.entries(this.usuarios).map(([rut, formGroup]) => ({
      ...formGroup.value,
      rut: rut
    }));
    localStorage.setItem('usuarios', JSON.stringify(usuariosArray));
  }

  private cargarUsuariosDesdeLocalStorage(): void {
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
      const usuariosArray: Usuario[] = JSON.parse(usuariosGuardados);
      usuariosArray.forEach(usuario => {
        this.agregarUsuario(usuario);
      });
    }
  }

  public obtenerUsuarioActual(nombre: string, contraseña: string): FormGroup | undefined {
    const usuario = this.validarUsuario(nombre, contraseña);
    return usuario;
  }

  // --- Viajes ---
  
  private viajes: Viaje[] = [];
  private idCounter: number = 1; 

  obtenerDatosViajes(): Viaje[] {
    const viajes = localStorage.getItem('viajes');
    return viajes ? JSON.parse(viajes) as Viaje[] : [];
  }

  guardarDatosViaje(datos: any): void {
    const viajes = this.obtenerDatosViajes(); 
    viajes.push(datos); 
    localStorage.setItem('viajes', JSON.stringify(viajes)); 
  }

  eliminarDatosViaje(id: number): void {
    const viajes = this.obtenerDatosViajes();
    const viajesActualizados = viajes.filter(viaje => viaje.id !== id);
    localStorage.setItem('viajes', JSON.stringify(viajesActualizados));
  }

}