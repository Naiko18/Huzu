import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioAppPage } from './inicio-app.page';

describe('InicioAppPage', () => {
  let component: InicioAppPage;
  let fixture: ComponentFixture<InicioAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
