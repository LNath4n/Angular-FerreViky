import { Component, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideSearch } from '@lucide/angular';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { CarritosService } from '@core/services/Carrito/CarritosService';
import { AuthService } from '@core/services/Auth/auth';
import { Producto } from '@core/models/Producto/productoModels';
import { AlertaService } from '@core/services/Modals/ModalsService';

@Component({
  selector: 'app-todos-los-productos',
  imports: [CommonModule, FormsModule, LucideSearch],
  templateUrl: './todos-los-productos.html',
  styleUrl: './todos-los-productos.css',
})
export class TodosLosProductos implements AfterViewInit, OnDestroy {

  private productosService = inject(ProductosService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private carritosService = inject(CarritosService);
  private alerta = inject(AlertaService);

  private readonly tamanoPagina = 24;   // múltiplo de 2, 3 y 4: filas completas en cualquier ancho
  productos = signal<Producto[]>([]);
  cargando = signal(false);
  paginaActual = 0;
  hayMasPaginas = true;

  textoBusqueda = '';              // lo que el usuario está escribiendo
  private busquedaActiva = '';     // lo que realmente se buscó (para las páginas siguientes)
  private peticion?: Subscription;

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

  verDetalle(id: number) {
    this.router.navigate(['/productos', id]);
  }

  agregarAlCarrito(idProducto: number) {
    if (!this.authService.getToken()) {
      this.alerta.advertencia('Debes de iniciar sesion');
      return;
    }

    this.carritosService.agregar({ idProducto, cantidad: 1 })
      .subscribe({
        next: (res) => {
          this.alerta.exito('Se agregó correctamente al carrito.');
          console.log(res)
        },
        error: (err) => {
          console.error(err)
          this.alerta.error('Hubo algún error al agregar el producto.')
        }
      });
  }
}