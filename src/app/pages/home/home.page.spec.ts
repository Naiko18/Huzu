/*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { IonicModule } from '@ionic/angular';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente HomePage', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los datos del usuario desde localStorage', () => {
    const usuarioMock = { nom_usuario: 'Juan', tip_user: 'administrador' };
    localStorage.setItem('usuario', JSON.stringify(usuarioMock));

    component.ngOnInit();

    expect(component.usuario.nom_usuario).toBe('Juan');
    expect(component.usuario.tip_user).toBe('administrador');
  });

  it('debería seleccionar correctamente la pestaña cuando se cambia', () => {
    const eventMock = { target: { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() } } };

    component.onTabChange(eventMock);

    expect(eventMock.target.classList.add).toHaveBeenCalledWith('tab-selected');
  });

  it('debería mostrar la pestaña de "Administración" solo si el usuario es administrador', () => {
    const usuarioMock = { tip_user: 'administrador' };
    localStorage.setItem('usuario', JSON.stringify(usuarioMock));
    component.ngOnInit();
    fixture.detectChanges();

    const tabAdmin = fixture.nativeElement.querySelector('ion-tab-button[tab="admininicio"]');
    expect(tabAdmin).toBeTruthy();
  });

  it('no debería mostrar la pestaña de "Administración" si el usuario no es administrador', () => {
    const usuarioMock = { tip_user: 'usuario' };
    localStorage.setItem('usuario', JSON.stringify(usuarioMock));
    component.ngOnInit();
    fixture.detectChanges();

    const tabAdmin = fixture.nativeElement.querySelector('ion-tab-button[tab="admininicio"]');
    expect(tabAdmin).toBeNull();
  });
});