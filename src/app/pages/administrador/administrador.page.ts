import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  usuario: FormGroup; 
  usuarios: FormGroup[] = []; 
  showAlert = false;
  tieneVehiculo: boolean = false;
  isEditing: boolean = false;
  editingUsuario: FormGroup | null = null;

  constructor(private usuarioService: UsuarioService) { 
    this.usuario = new FormGroup({ 
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
  }

  ngOnInit() {
    this.obtenerUsuarios(); 
  }

  agregarUsuario() {
    if (this.usuario.valid) {
        const exito = this.usuarioService.agregarUsuario(this.usuario.value);
        if (exito) {
            this.obtenerUsuarios(); 
            this.resetForm();
        }
    } else {
        console.log('Formulario no válido:', this.usuario.errors);
    }
  }

  deleteUsuario(rut: string) {
    const result = this.usuarioService.eliminarUsuario(rut);
    if (result) {
      console.log('Usuario eliminado:', rut);
      this.obtenerUsuarios();
    } else {
      console.log('Usuario no encontrado para eliminar:', rut);
    }
  }

  editUsuario(usuario: FormGroup) {
    this.editingUsuario = usuario;
    this.isEditing = true; 
    this.usuario.patchValue({
      nom_usuario: usuario.get('nom_usuario')?.value,
      contraseña: usuario.get('contraseña')?.value,
      correo: usuario.get('correo')?.value,
      rut: usuario.get('rut')?.value,
      fec_nacimiento: usuario.get('fec_nacimiento')?.value,
      genero: usuario.get('genero')?.value,
      pos_vehiculo: usuario.get('pos_vehiculo')?.value,
      patente: usuario.get('patente')?.value,
      cantidad_asientos: usuario.get('cantidad_asientos')?.value,
    });
  }
  
  confirmEdit() {
    if (this.editingUsuario) {
      this.usuarioService.modificarUsuario(this.editingUsuario.get('rut')?.value, this.usuario);
      this.isEditing = false; 
      this.editingUsuario = null; 
      this.obtenerUsuarios();
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

  obtenerUsuarios() {
    this.usuarios = this.usuarioService.obtenerUsuarios();
  }
}