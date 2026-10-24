import { Component, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucidePackage, LucideSearch } from '@lucide/angular';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { CarritosService } from '@core/services/Carrito/CarritosService';
import { AuthService } from '@core/services/Auth/auth';
import { ProductoPublicoResponse } from '@core/models/Producto/productoModels';
import { AlertaService } from '@core/services/Modals/ModalsService';

@Component({
  selector: 'app-todos-los-productos',
  imports: [CommonModule, FormsModule, LucideSearch, LucidePackage],
  templateUrl: './todos-los-productos.html',
  styleUrl: './todos-los-productos.css',
})
export class TodosLosProductos implements AfterViewInit, OnDestroy {

  private productosService = inject(ProductosService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private carritosService = inject(CarritosService);
  private alerta = inject(AlertaService);

  isLoggedIn = this.authService.isLoggedIn;
  nombreUsuario = this.authService.nombre;

  private readonly tamanoPagina = 24;   // múltiplo de 2, 3 y 4: filas completas en cualquier ancho
  productos = signal<ProductoPublicoResponse[]>([]);
  cargando = signal(false);
  paginaActual = 0;
  hayMasPaginas = true;

  textoBusqueda = '';              // lo que el usuario está escribiendo
  private busquedaActiva = '';     // lo que realmente se buscó (para las páginas siguientes)
  private peticion?: Subscription;

  // IDs de productos cuya imagen no existe (se muestra el ícono de paquete)
  private imagenesFallidas = signal<Set<number>>(new Set());

  private scrollListener!: () => void;
  private sidenavContent!: Element;

  ngAfterViewInit() {
    this.cargarMas(); // Carga inicial

    const el = document.querySelector('mat-sidenav-content');
    if (!el) return;

    this.sidenavContent = el;
    this.scrollListener = () => this.checkScroll();
    this.sidenavContent.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy() {
    this.peticion?.unsubscribe();
    this.sidenavContent?.removeEventListener('scroll', this.scrollListener);
  }

  private checkScroll() {
    const el = this.sidenavContent;
    const distanciaAlFondo = el.scrollHeight - el.scrollTop - el.clientHeight;

    // Cuando estemos a menos de 300px del fondo, cargamos
    if (distanciaAlFondo < 300) {
      this.cargarMas();
    }
  }

  cargarMas() {
    if (this.cargando() || !this.hayMasPaginas) return;

    this.cargando.set(true);
    this.peticion = this.productosService
      .buscar({ q: this.busquedaActiva }, this.paginaActual, this.tamanoPagina)
      .subscribe({
        next: (page) => {
          this.productos.update(actual => [...actual, ...page.content]);
          this.hayMasPaginas = this.paginaActual < page.totalPages - 1;
          this.paginaActual++;
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false)
      });
  }

  buscar() {
    this.peticion?.unsubscribe();           // descarta una respuesta vieja que siga en camino
    this.busquedaActiva = this.textoBusqueda;
    this.productos.set([]);
    this.paginaActual = 0;
    this.hayMasPaginas = true;
    this.cargando.set(false);
    this.cargarMas();
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.buscar();
  }


  imagenFallida(id: number): boolean {
    return this.imagenesFallidas().has(id);
  }

  marcarImagenFallida(id: number) {
    this.imagenesFallidas.update(s => new Set(s).add(id));
  }

  verDetalle(slug: string) {
    this.router.navigate(['/productos', slug]);
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
}