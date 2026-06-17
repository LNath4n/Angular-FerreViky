import { Component, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { CarritosService } from '@core/services/Carrito/CarritosService';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/Auth/auth';
import { Producto } from '@core/models/Producto/productoModels';

@Component({
  selector: 'app-todos-los-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './todos-los-productos.html',
  styleUrl: './todos-los-productos.css',
})
export class TodosLosProductos implements AfterViewInit, OnDestroy {

  private productosService = inject(ProductosService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private carritosService = inject(CarritosService);

  textoBusqueda = '';
  mensaje = '';
  productos = signal<Producto[]>([]);
  cargando = signal(false);
  paginaActual = 0;
  hayMasPaginas = true;

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
    this.sidenavContent?.removeEventListener('scroll', this.scrollListener);
  }

  private checkScroll() {
    const el = this.sidenavContent;
    const distanciaAlFondo = el.scrollHeight - el.scrollTop - el.clientHeight;

    // Cuando estemos a menos de 200px del fondo, cargamos
    if (distanciaAlFondo < 300) {
      this.cargarMas();
    }
  }

  cargarMas() {
    if (this.cargando() || !this.hayMasPaginas) return;

    this.cargando.set(true);
    this.productosService.getAll(this.paginaActual).subscribe({
      next: (page) => {
        this.productos.update(actual => [...actual, ...page.content]);
        this.hayMasPaginas = this.paginaActual < page.totalPages - 1;
        this.paginaActual++;
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  get productosFiltrados(): Producto[] {
    const texto = this.textoBusqueda.toLowerCase().trim();
    if (!texto) return this.productos();
    return this.productos().filter(p =>
      p.marca.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto)
    );
  }

  verDetalle(id: number) {
    this.router.navigate(['/productos', id]);
  }

  agregarAlCarrito(idProducto: number) {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.carritosService.agregar({ idProducto, cantidad: 1 })
      .subscribe({
        next: (res) => {
          this.mensaje = 'Se agrego correctamente';
          console.log(res)
        },
        error: (err) => {
          console.error(err)
          this.mensaje = 'Hubo algun error';
        }
      });
  }
}