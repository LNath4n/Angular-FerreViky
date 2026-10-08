import { CanDeactivateFn } from '@angular/router';

export interface ComponenteConCambios {
  hayCambiosSinGuardar(): boolean;
}

export const cambiosSinGuardarGuard: CanDeactivateFn<ComponenteConCambios> = (component) => {
  if (component.hayCambiosSinGuardar()) {
    return confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
  }
  return true;
};