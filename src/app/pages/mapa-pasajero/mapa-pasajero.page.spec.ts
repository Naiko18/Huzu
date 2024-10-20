import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaPasajeroPage } from './mapa-pasajero.page';

describe('MapaPasajeroPage', () => {
  let component: MapaPasajeroPage;
  let fixture: ComponentFixture<MapaPasajeroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaPasajeroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
