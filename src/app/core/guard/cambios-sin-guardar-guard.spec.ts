import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { cambiosSinGuardarGuard } from './cambios-sin-guardar-guard';

describe('cambiosSinGuardarGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => cambiosSinGuardarGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
