import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LucidePackage, LucideArrowLeft } from '@lucide/angular';
import { ProductoPublicoResponse } from '@core/models/Producto/productoModels';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { AuthService } from '@core/services/Auth/auth';
import { CarritosService } from '@core/services/Carrito/CarritosService';
import { AlertaService } from '@core/services/Modals/ModalsService';

@Component({
  selector: 'app-un-producto',
  imports: [AsyncPipe, LucidePackage, LucideArrowLeft],
  templateUrl: './un-producto.html',
  styleUrl: './un-producto.css',
})
export class UnProducto {

  private productosService = inject(ProductosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private carritosService = inject(CarritosService);
  private alerta = inject(AlertaService);

  // IDs de productos cuya imagen no existe (se muestra el ícono de paquete)
  private imagenesFallidas = signal<Set<number>>(new Set());

  slug$ = this.route.paramMap.pipe(
    map(params => params.get('slug') ?? '')
  );

  producto$: Observable<ProductoPublicoResponse> = this.slug$.pipe(
    switchMap(slug => this.productosService.getBySlug(slug))
  );

  imagenFallida(id: number): boolean {
    return this.imagenesFallidas().has(id);
  }

  marcarImagenFallida(id: number) {
    this.imagenesFallidas.update(s => new Set(s).add(id));
  }

  agregarAlCarrito(idProducto: number) {
    if (!this.authService.getToken()) {
      this.alerta.advertencia('Debes de iniciar sesion');
      return;
    }

    this.carritosService.agregar({ idProducto, cantidad: 1 })
      .subscribe({
        next: () => {
          this.alerta.exito('Se agregó correctamente al carrito.');
        },
        error: error => {
          const mensaje = this.mensajeError(error);
          this.alerta.error(
            mensaje ?? 'No se pudo agregar el producto al carrito. Revisa su disponibilidad e intenta de nuevo.'
          );
        }
      });
  }

  private mensajeError(error: unknown): string | null {
    if (!(error instanceof HttpErrorResponse)) return null;

    const cuerpo: unknown = error.error;
    if (typeof cuerpo === 'string' && cuerpo.trim()) return cuerpo.trim();

    if (typeof cuerpo === 'object' && cuerpo !== null) {
      if ('error' in cuerpo && typeof cuerpo.error === 'string' && cuerpo.error.trim()) {
        return cuerpo.error.trim();
      }
      if ('message' in cuerpo && typeof cuerpo.message === 'string' && cuerpo.message.trim()) {
        return cuerpo.message.trim();
      }
    }

    return null;
  }

  regresar() {
    this.router.navigate(['/productos']);
  }
}