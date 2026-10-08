import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrarProductos } from './administrar-productos';

describe('AdministrarProductos', () => {
  let component: AdministrarProductos;
  let fixture: ComponentFixture<AdministrarProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarProductos],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrarProductos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
