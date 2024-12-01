/*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { of } from 'rxjs';


describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let mockFirebaseService: jasmine.SpyObj<FirebaseService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['getUsuario']);
    mockFirebaseService = jasmine.createSpyObj('FirebaseService', ['fireAuth']);

    TestBed.configureTestingModule({
      declarations: [PerfilPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: FirebaseService, useValue: mockFirebaseService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente PerfilPage', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los datos del usuario desde localStorage', () => {
    const usuarioMock = { nom_usuario: 'Juan', rut: '12345678-9', fec_nacimiento: '1990-01-01', genero: 'Masculino', correo: 'juan@correo.com' };
    localStorage.setItem('usuario', JSON.stringify(usuarioMock));

    component.ngOnInit();

    expect(component.usuario.nom_usuario).toBe('Juan');
    expect(component.usuario.rut).toBe('12345678-9');
  });

  it('debería generar un código QR con la URL proporcionada', () => {
    const data = 'https://huzuaplicacion.web.app/registro';
    component.generateQRCode(data);
    expect(component.qrCodeDataUrl).toContain('data:image/png;base64');
  });

  it('debería navegar a términos y condiciones', () => {
    spyOn(component.route, 'navigate');
    component.irTerminos();
    expect(component.route.navigate).toHaveBeenCalledWith(['/home/terminos']);
  });

  it('debería navegar a método de pago', () => {
    spyOn(component.route, 'navigate');
    component.irMetodoPago();
    expect(component.route.navigate).toHaveBeenCalledWith(['/home/metodopago']);
  });

  it('debería navegar a listado de viajes', () => {
    spyOn(component.route, 'navigate');
    component.irListadoViaje();
    expect(component.route.navigate).toHaveBeenCalledWith(['/home/listadoviaje']);
  });

  it('debería navegar a editar perfil', () => {
    spyOn(component.route, 'navigate');
    component.irEditarPerfil();
    expect(component.route.navigate).toHaveBeenCalledWith(['/home/editarperfil']);
  });

  it('debería cerrar sesión y redirigir a login', async () => {
    spyOn(component.FirebaseService.fireAuth, 'signOut').and.returnValue(Promise.resolve());
    spyOn(component.route, 'navigate');

    await component.cerrarSesion();

    expect(localStorage.getItem('usuario')).toBeNull();
    expect(component.route.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería mostrar los campos de patente y modelo de vehículo si el usuario es conductor', () => {
    component.usuario = { tip_user: 'Conductor', patente: 'XX 1234', mod_vehi: 'Ford' };
    fixture.detectChanges();
    const patente = fixture.nativeElement.querySelector('ion-item');
    const modelo = fixture.nativeElement.querySelector('ion-item:nth-child(6)');
    
    expect(patente).toBeTruthy();
    expect(modelo).toBeTruthy();
  });

  it('debería mostrar el nombre del usuario en el perfil', () => {
    component.usuario = { nom_usuario: 'Juan' };
    fixture.detectChanges();
    const nombreUsuario = fixture.nativeElement.querySelector('h2');
    expect(nombreUsuario.textContent).toContain('Juan');
  });
});