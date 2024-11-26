import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Firestore, collection, addDoc, doc, getDocs, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';

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
  cantidad_asientos?: string; 
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
  return edad >= 18 ? null : { menorDeEdad: true };
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosCollection = collection(this.firestore, 'usuarios');
  private viajesCollection = collection(this.firestore, 'viajes');

  constructor(private firestore: Firestore) {}

  async agregarUsuario(nuevoUsuario: Usuario): Promise<boolean> {
    const usuarioDoc = doc(this.usuariosCollection, nuevoUsuario.rut);
    const usuarioSnapshot = await getDocs(query(this.usuariosCollection, where('rut', '==', nuevoUsuario.rut)));

    if (!usuarioSnapshot.empty) {
      return false;
    } else {
      await addDoc(this.usuariosCollection, nuevoUsuario);
      return true;
    }
  }

  async modificarUsuario(rut: string, usuarioModificado: any): Promise<void> {
    const usuarioDoc = doc(this.usuariosCollection, rut);
    await updateDoc(usuarioDoc, usuarioModificado);
  }

  async eliminarUsuario(rut: string): Promise<boolean> {
    const usuarioDoc = doc(this.usuariosCollection, rut);
    const usuarioSnapshot = await getDocs(query(this.usuariosCollection, where('rut', '==', rut)));

    if (!usuarioSnapshot.empty) {
      await deleteDoc(usuarioDoc);
      return true;
    }
    return false;
  }

  async obtenerUsuarios(): Promise<FormGroup[]> {
    const snapshot = await getDocs(this.usuariosCollection);
    return snapshot.docs.map(doc => {
      const data = doc.data() as Usuario;
      return new FormGroup({
        nom_usuario: new FormControl(data.nom_usuario),
        contraseña: new FormControl(data.contraseña),
        rep_contraseña: new FormControl(data.rep_contraseña),
        correo: new FormControl(data.correo),
        rut: new FormControl(data.rut),
        fec_nacimiento: new FormControl(data.fec_nacimiento),
        genero: new FormControl(data.genero),
        pos_vehiculo: new FormControl(data.pos_vehiculo),
        patente: new FormControl(data.patente),
        cantidad_asientos: new FormControl(data.cantidad_asientos),
        mod_vehi: new FormControl(data.mod_vehi),
        tip_user: new FormControl(data.tip_user),
      });
    });
  }

  async validarUsuario(nombre: string, contraseña: string): Promise<FormGroup | undefined> {
    const snapshot = await getDocs(query(this.usuariosCollection, where('nom_usuario', '==', nombre), where('contraseña', '==', contraseña)));
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data() as Usuario;
      return new FormGroup({
        nom_usuario: new FormControl(data.nom_usuario),
        contraseña: new FormControl(data.contraseña),
        rep_contraseña: new FormControl(data.rep_contraseña),
        correo: new FormControl(data.correo),
        rut: new FormControl(data.rut),
        fec_nacimiento: new FormControl(data.fec_nacimiento),
        genero: new FormControl(data.genero),
        pos_vehiculo: new FormControl(data.pos_vehiculo),
        patente: new FormControl(data.patente),
        cantidad_asientos: new FormControl(data.cantidad_asientos),
        mod_vehi: new FormControl(data.mod_vehi),
        tip_user: new FormControl(data.tip_user),
      });
    }
    return undefined;
  }

  async guardarDatosViaje(viaje: Viaje): Promise<void> {
    await addDoc(this.viajesCollection, viaje);
  }

  async eliminarDatosViaje(id: number): Promise<void> {
    const snapshot = await getDocs(query(this.viajesCollection, where('id', '==', id)));
    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await deleteDoc(docRef);
    }
  }

  async obtenerDatosViajes(): Promise<Viaje[]> {
    const snapshot = await getDocs(this.viajesCollection);
    return snapshot.docs.map(doc => doc.data() as Viaje);
  }
}