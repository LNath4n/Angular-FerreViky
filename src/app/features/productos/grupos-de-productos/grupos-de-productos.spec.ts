import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposDeProductos } from './grupos-de-productos';

describe('GruposDeProductos', () => {
  let component: GruposDeProductos;
  let fixture: ComponentFixture<GruposDeProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruposDeProductos],
    }).compileComponents();

    fixture = TestBed.createComponent(GruposDeProductos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
