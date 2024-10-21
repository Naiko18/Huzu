import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetodopagoPage } from './metodopago.page';

describe('MetodopagoPage', () => {
  let component: MetodopagoPage;
  let fixture: ComponentFixture<MetodopagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodopagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
