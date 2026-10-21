import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Verperfil } from './verperfil';

describe('Verperfil', () => {
  let component: Verperfil;
  let fixture: ComponentFixture<Verperfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verperfil],
    }).compileComponents();

    fixture = TestBed.createComponent(Verperfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
