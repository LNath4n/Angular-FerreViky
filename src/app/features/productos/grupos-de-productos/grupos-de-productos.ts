import { Component, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { FormsModule } from '@angular/forms';
import { GrupoPublico } from '@core/models/Producto/productoModels';

@Component({
  selector: 'app-grupos-de-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './grupos-de-productos.html',
  styleUrl: './grupos-de-productos.css',
})
export class GruposDeProductos implements AfterViewInit, OnDestroy {

  private productosService = inject(ProductosService);
  private router = inject(Router);

  textoBusqueda = '';

  grupos = signal<GrupoPublico[]>([]);
  cargando = signal(false);
  paginaActual = 0;
  hayMasPaginas = true;

  private scrollListener!: () => void;
  private sidenavContent!: Element;

  ngAfterViewInit() {
    this.cargarMas();

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

    if (distanciaAlFondo < 300) {
      this.cargarMas();
    }
  }

  cargarMas() {
    if (this.cargando() || !this.hayMasPaginas) return;

    this.cargando.set(true);
    this.productosService.getAllGrupos(this.paginaActual).subscribe({
      next: (page) => {
        this.grupos.update(actual => [...actual, ...page.content]);
        this.hayMasPaginas = this.paginaActual < page.totalPages - 1;
        this.paginaActual++;
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  get gruposFiltrados(): GrupoPublico[] {
    const texto = this.textoBusqueda.toLowerCase().trim();
    if (!texto) return this.grupos();
    return this.grupos().filter(g =>
      g.nombre.toLowerCase().includes(texto)
    );
  }

  verDetalle(id: number) {
    this.router.navigate(['/grupos', id]);
  }
}