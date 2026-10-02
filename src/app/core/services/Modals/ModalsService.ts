import { Injectable, signal } from '@angular/core';

export type TipoAlerta = 'exito' | 'error' | 'advertencia';

export interface Alerta {
  id: number;
  tipo: TipoAlerta;
  titulo: string;
  texto: string;
}

@Injectable({ providedIn: 'root' })
export class AlertaService {
  readonly alertas = signal<Alerta[]>([]);
  private contador = 0;

  private mostrar(tipo: TipoAlerta, titulo: string, texto: string, duracionMs = 4000) {
    const id = ++this.contador;
    this.alertas.update(actual => [...actual, { id, tipo, titulo, texto }]);
    setTimeout(() => this.cerrar(id), duracionMs);
  }

  exito(texto: string, titulo = '¡Listo!') {
    this.mostrar('exito', titulo, texto);
  }

  error(texto: string, titulo = 'Ups...') {
    this.mostrar('error', titulo, texto);
  }

  advertencia(texto: string, titulo = 'Atención') {
    this.mostrar('advertencia', titulo, texto);
  }

  cerrar(id: number) {
    this.alertas.update(actual => actual.filter(a => a.id !== id));
  }
}