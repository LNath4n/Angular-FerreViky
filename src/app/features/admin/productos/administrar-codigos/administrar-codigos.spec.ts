import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AlertaService } from '@core/services/Modals/ModalsService';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { CodigosAdminService } from '@core/services/admin/CodigosAdminService/codigos-admin-service';
import { AdministrarCodigos } from './administrar-codigos';

describe('AdministrarCodigos', () => {
  let component: AdministrarCodigos;
  let fixture: ComponentFixture<AdministrarCodigos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarCodigos],
      providers: [
        {
          provide: ProductosService,
          useValue: {
            buscar: () => of({ content: [], totalPages: 0, totalElements: 0, number: 0, size: 5 }),
          },
        },
        {
          provide: CodigosAdminService,
          useValue: { cargarCodigos: () => of({ guardados: 0 }) },
        },
        {
          provide: AlertaService,
          useValue: { error: () => undefined, exito: () => undefined },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrarCodigos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
