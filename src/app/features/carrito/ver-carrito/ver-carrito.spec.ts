import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCarrito } from './ver-carrito';

describe('VerCarrito', () => {
  let component: VerCarrito;
  let fixture: ComponentFixture<VerCarrito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerCarrito],
    }).compileComponents();

    fixture = TestBed.createComponent(VerCarrito);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
