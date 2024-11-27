import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})


export class FirebaseService {
  

  constructor(private fireStore: AngularFirestore, private fireAuth: AngularFireAuth) {}


  async crearUsuario(usuarios: any){
    const docRef = this.fireStore.collection('usuarios').doc(usuarios.rut);
    const docActual = await docRef.get().toPromise();
    if(docActual?.exists){
      return false;
    }
    const credencialesUsuario = await this.fireAuth.createUserWithEmailAndPassword(usuarios.correo,usuarios.contraseña);
    const uid = credencialesUsuario.user?.uid;
    await docRef.set( {...usuarios,uid} );
    return true;
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
}