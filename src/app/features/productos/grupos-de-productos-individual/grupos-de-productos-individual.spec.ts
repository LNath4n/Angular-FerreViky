import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposDeProductosIndividual } from './grupos-de-productos-individual';

describe('GruposDeProductosIndividual', () => {
  let component: GruposDeProductosIndividual;
  let fixture: ComponentFixture<GruposDeProductosIndividual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruposDeProductosIndividual],
    }).compileComponents();

    fixture = TestBed.createComponent(GruposDeProductosIndividual);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
