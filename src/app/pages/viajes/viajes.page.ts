import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Viaje } from 'src/app/services/usuario.service';
import { MapaConductorPage } from '../mapa-conductor/mapa-conductor.page'; 
import { ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';



@Component({
  selector: 'app-viajes', 
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  mensajeBienvenida: string | undefined;
  usuario: any;
  animacion: 'entrar' | 'salir' = 'entrar'; 
  viajes: any[] = [];
  costoTotal: number = 0;
  asientosDisponiblesTemp!: number;
  viaje: any;
  botonDeshabilitado: boolean = false;
  
  

  constructor(private firebaseService: FirebaseService, private usuarioService: UsuarioService, private route: Router, private toastController: ToastController) { }

  ngOnInit() {
    this.cargarViajes();
    this.mensajeBienvenida = this.getWelcomeMessage();
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
  
    this.firebaseService.obtenerDatosViajes().subscribe((viajes) => {
      if (viajes.length > 0) {
        this.viajes = viajes.map(v => ({ ...v })); 
        console.log('Viajes cargados:', this.viajes);
      } else {
        console.warn('No hay viajes cargados.');
        this.viajes = [];
      }
    });
  }

  ionViewWillEnter() {
    this.cargarViajes();
  }

  cargarViajes() {
    this.firebaseService.obtenerDatosViajes().subscribe((viajes) => {
      this.viajes = viajes; 
    }, error => {
      console.error("Error al cargar los viajes:", error);
    });
  }
  

  getWelcomeMessage(): string {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 12) {
      return 'Buenos días,';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Buenas tardes,';
    } else {
      return 'Buenas noches,';
    }
  }

  animacionSalir(){
    setTimeout(() => {
      this.animacion = 'salir';
    }, 2000);
  }

  irmapaConductor(){

    this.route.navigate(['/home/mapa-conductor']);

  }

  irmapaUsuario() {
    
    this.route.navigate(['/home/mapa-pasajero']);
  
  }

  cancelarViaje(){

    this.route.navigate(['home/viajes']);

  }

  verViaje(){

    this.route.navigate(['/home/mapa-conductor-rutas'])

  }

  eliminarviaje(id: string) {

    this.firebaseService.eliminarDatosViaje(id);
    this.cargarViajes();
  
  }


  public reservarAsiento() {
    this.botonDeshabilitado = true;  
    this.mostrarToast('¡tu viaje comenzará en 5 minutos! 🏃🏻');
  }
  
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, 
      position: 'top', 
      color: 'dark', 
      cssClass: 'custom-toast',
    });
    toast.present();  
  }


  public async finalizarViaje() {
    try {
      // Obtener los datos del viaje desde el localStorage
      const viajeData = localStorage.getItem('viajeConfirmado');
      if (!viajeData) {
        console.error('No se encontraron datos de viaje en el localStorage.');
        return;
      }
  
      // Parsear los datos del viaje
      const viaje = JSON.parse(viajeData);
  
      // Verificar que el ID del viaje esté disponible
      if (!viaje.id) {
        console.error('No se encontró el ID del viaje.');
        return;
      }
  
      // Obtener la referencia del viaje en Firestore
      const viajeRef = this.firebaseService.fireStore.collection('viajes').doc(viaje.id);
      const viajeDoc = await viajeRef.get().toPromise();
  
      // Comprobar si el documento existe
      if (!viajeDoc || !viajeDoc.exists) {
        console.error('El viaje no fue encontrado en la base de datos o está vacío.');
        return;
      }
  
      const viajeDataFirestore = viajeDoc.data() as Viaje;
  
      // Verificar si el estado del viaje es 'En curso' antes de finalizar
      if (viajeDataFirestore.estado === 'En curso') {
        // Actualizar el estado a 'Finalizado'
        await viajeRef.update({ estado: 'Finalizado' });
        console.log('Viaje finalizado correctamente');
      } else {
        console.warn('El viaje no está en curso, no se puede finalizar.');
      }
    } catch (error) {
      console.error('Error al finalizar el viaje:', error);
    }
  }

  public async iniciarViaje() {
    try {
      // Obtener los datos del viaje desde el localStorage
      const viajeData = localStorage.getItem('viajeConfirmado');
      if (!viajeData) {
        console.error('No se encontraron datos de viaje en el localStorage.');
        return;
      }
  
      // Parsear los datos del viaje
      const viaje = JSON.parse(viajeData);
  
      // Verificar que el ID del viaje esté disponible
      if (!viaje.id) {
        console.error('No se encontró el ID del viaje.');
        return;
      }
  
      // Obtener la referencia del viaje en Firestore
      const viajeRef = this.firebaseService.fireStore.collection('viajes').doc(viaje.id);
      const viajeDoc = await viajeRef.get().toPromise();
  
      // Comprobar si el documento existe
      if (!viajeDoc || !viajeDoc.exists) {
        console.error('El viaje no fue encontrado en la base de datos o está vacío.');
        return;
      }
  
      const viajeDataFirestore = viajeDoc.data() as Viaje;
  
      // Verificar si el estado del viaje es 'Pendiente' antes de iniciar
      if (viajeDataFirestore.estado === 'Pendiente') {
        // Actualizar el estado a 'En curso'
        await viajeRef.update({ estado: 'En curso' });
        console.log('Viaje iniciado correctamente');
      } else {
        console.warn('El viaje no está pendiente, no se puede iniciar.');
      }
    } catch (error) {
      console.error('Error al iniciar el viaje:', error);
    }
  }
  public seleccionarViaje(viaje: any) {
    if (!viaje || !viaje.id) {
      console.error('El viaje seleccionado no tiene un ID válido.');
      return;
    }
    this.viaje = viaje;
    console.log('Viaje seleccionado:', this.viaje);
  }


}