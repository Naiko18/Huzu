import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Viaje } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
 

export class FirebaseService {
  

  constructor(public fireStore: AngularFirestore, public fireAuth: AngularFireAuth, private alertController: AlertController) {}

  async crearUsuario(usuario: any){
    const docRef = this.fireStore.collection('usuarios').doc(usuario.rut);
    const docActual = await docRef.get().toPromise();
    if(docActual?.exists){
      return false;
    }
    const credencialesUsuario = await this.fireAuth.createUserWithEmailAndPassword(usuario.correo,usuario.contraseña);
    const uid = credencialesUsuario.user?.uid;
    await docRef.set( {...usuario,uid} );
    return true;
  }
  
  async loginUsuario(correo: string, contraseña: string) {
    try {
      const credencialesUsuario = await this.fireAuth.signInWithEmailAndPassword(correo, contraseña);
      return credencialesUsuario;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return null;
    }
  }

  getUsuarioUid(uid: string): Promise<any>{
    return this.fireStore.collection('usuarios', ref => ref.where('uid', '==', uid)).get().toPromise().then((snapshot) => {
      if (snapshot && !snapshot.empty){
        return snapshot.docs[0].data();
      }
      return null;
    }).catch((error) => {
      console.error("Error al obtener usuario:", error);
      return null;
    })
  }

  getUsuarios(){
    return this.fireStore.collection('usuarios').valueChanges();
  }

  getUsuario(rut: string){
    return this.fireStore.collection('usuarios').doc(rut).valueChanges();
  }

  updateUsuario(usuario: any){
    return this.fireStore.collection('usuarios').doc(usuario.rut).update(usuario);
  }

  deleteUsuario(rut: string){
    return this.fireStore.collection('usuarios').doc(rut).delete();
  }
  

  async recuperarContrasena(email: string): Promise<void> {
    try {
      await this.fireAuth.sendPasswordResetEmail(email);
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Se ha enviado un correo para restablecer tu contraseña.',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: this.obtenerMensajeError(error.code),
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  obtenerMensajeError(codigo: string): string {
    switch (codigo) {
      case 'auth/user-not-found':
        return 'No existe un usuario con este correo.';
      case 'auth/invalid-email':
        return 'El correo ingresado no es válido.';
      default:
        return 'Ocurrió un error inesperado. Intenta nuevamente.';
    }
  }

  async actualizarContrasenaFirestore(correo: string, nuevaContrasena: string): Promise<void> {
    try {
      const usuariosRef = this.fireStore.collection('usuarios', ref => ref.where('correo', '==', correo));
      const snapshot = await usuariosRef.get().toPromise();
  
      if (snapshot && !snapshot.empty) {
        const doc = snapshot.docs[0];
        await doc.ref.update({
          contraseña: nuevaContrasena,
          rep_contraseña: nuevaContrasena // Actualiza ambos campos
        });
        console.log('Contraseña actualizada en Firestore');
      } else {
        console.error('Usuario no encontrado en Firestore');
        throw new Error('Usuario no encontrado en Firestore');
      }
    } catch (error) {
      console.error('Error al actualizar contraseña en Firestore:', error);
      throw new Error('Error al actualizar la contraseña en Firestore');
    }
  }
   // ------------------ viajes

   private idCounter: number = 1;
   private collectionName = 'viajes';

   obtenerDatosViajes(): Observable<Viaje[]> {
    return this.fireStore.collection<Viaje>(this.collectionName).valueChanges({ idField: 'id' });
  }

  guardarDatosViaje(datos: any): void {
    const id = datos.id;  
  
    this.fireStore
      .collection('viajes')
      .doc(id) 
      .set(datos)
      .then(() => console.log('Viaje guardado exitosamente'))
      .catch(error => console.error('Error al guardar el viaje:', error));
  }

  eliminarDatosViaje(id: string): void {
    this.fireStore
      .collection(this.collectionName)
      .doc(id)
      .delete()
      .then(() => console.log('Viaje eliminado exitosamente'))
      .catch(error => console.error('Error al eliminar el viaje:', error));
  }


}