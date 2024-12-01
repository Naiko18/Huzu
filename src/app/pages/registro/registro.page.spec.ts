/* 
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegistroPage } from './registro.page';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

// Mock de servicios
class MockUsuarioService {
  agregarUsuario(usuario: any) {
    return true; 
  }
}

class MockFirebaseService {
  async crearUsuario(usuario: any) {
    return true;
  }
}

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, IonicModule.forRoot()],
      declarations: [RegistroPage],
      providers: [
        { provide: UsuarioService, useClass: MockUsuarioService },
        { provide: FirebaseService, useClass: MockFirebaseService },
        AlertController,
        Router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 1. Verificar si el componente se crea correctamente
  it('Debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // 2. Verificar que el formulario sea inválido si no se ha completado
  it('Debería ser inválido el formulario cuando no se llenan los campos obligatorios', () => {
    component.usuario.controls['nom_usuario'].setValue('');
    component.usuario.controls['contraseña'].setValue('');
    component.usuario.controls['rep_contraseña'].setValue('');
    component.usuario.controls['correo'].setValue('');
    component.usuario.controls['rut'].setValue('');
    component.usuario.controls['fec_nacimiento'].setValue('');
    expect(component.usuario.valid).toBeFalsy();
  });

  // 3. Verificar si el formulario es válido cuando todos los campos son correctos
  it('Debería ser válido el formulario cuando se llenan los campos correctamente', () => {
    component.usuario.controls['nom_usuario'].setValue('usuario');
    component.usuario.controls['contraseña'].setValue('Contraseña123!');
    component.usuario.controls['rep_contraseña'].setValue('Contraseña123!');
    component.usuario.controls['correo'].setValue('usuario@duocuc.cl');
    component.usuario.controls['rut'].setValue('12345678-9');
    component.usuario.controls['fec_nacimiento'].setValue('2000-01-01');
    component.usuario.controls['genero'].setValue('masculino');
    expect(component.usuario.valid).toBeTruthy();
  });

  // 4. Verificar que el método `usuario_registrado` llame a FirebaseService
  it('Debería llamar al método `crearUsuario` de FirebaseService cuando se registre un usuario', async () => {
    const firebaseService = TestBed.inject(FirebaseService);
    spyOn(firebaseService, 'crearUsuario').and.callThrough();
    await component.usuario_registrado();
    expect(firebaseService.crearUsuario).toHaveBeenCalled();
  });

  // 5. Verificar que la selección de "Sí" en la opción "¿Posee vehículo?" actualice el valor de "tip_user"
  it('Debería actualizar el valor de "tip_user" a "Conductor" cuando se selecciona "Sí" en "Posee vehículo"', () => {
    component.onVehiculoChange('Sí');
    expect(component.usuario.get('tip_user')?.value).toBe('Conductor');
  });
  
});