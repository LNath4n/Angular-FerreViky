import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { LucideTrash2 } from '@lucide/angular';
import { CarritosService } from '@core/services/Carrito/CarritosService';
import { AlertaService } from '@core/services/Modals/ModalsService';
import { Carrito } from '@core/models/Carrito/carritoModels';

type ItemCarrito = Carrito['productos'][number];

@Component({
  selector: 'app-ver-carrito',
  imports: [CommonModule, LucideTrash2],
  templateUrl: './ver-carrito.html',
  styleUrl: './ver-carrito.css',
})
export class VerCarrito {
  private carritoService = inject(CarritosService);
  private alerta = inject(AlertaService);
  private router = inject(Router);

  // Cada .next() vuelve a pedir el carrito sin vaciar la pantalla mientras llega
  private recargar$ = new BehaviorSubject<void>(undefined);
  carrito$ = this.recargar$.pipe(
    switchMap(() => this.carritoService.obtenerCarrito())   // GET /carrito
  );

  cambiarCantidad(item: ItemCarrito, delta: number) {
    const nueva = item.cantidad + delta;
    if (nueva < 1) return;

    this.carritoService.actualizar(item.productoId, nueva).subscribe({
      next: () => this.recargar$.next(),
      error: () => this.alerta.error('No se pudo actualizar la cantidad.')
    });
  }

  eliminar(productoId: number) {
    this.carritoService.eliminar(productoId).subscribe({
      next: () => {
        this.alerta.exito('Producto quitado del carrito.');
        this.recargar$.next();
      },
      error: () => this.alerta.error('No se pudo quitar el producto.')
    });
  }

  seguirComprando() {
    this.router.navigate(['/productos']);
  }
}