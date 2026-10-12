import { Component, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { GrupoPublico } from '@core/models/Producto/productoModels';
import { LucideEye, LucidePackage } from '@lucide/angular';

@Component({
  selector: 'app-grupos-de-productos',
  imports: [CommonModule, LucideEye, LucidePackage],
  templateUrl: './grupos-de-productos.html',
  styleUrl: './grupos-de-productos.css',
})
export class GruposDeProductos implements AfterViewInit, OnDestroy {
  private productosService = inject(ProductosService);
  private router = inject(Router);

  grupos = signal<GrupoPublico[]>([]);
  cargando = signal(false);
  paginaActual = 0;
  hayMasPaginas = true;

  private readonly intervaloCarruselMs = 3000;
  private imagenesFallidas = signal<Set<string>>(new Set());
  private tick = signal(0);
  private intervalo?: ReturnType<typeof setInterval>;

  private scrollListener!: () => void;
  private sidenavContent!: Element;

  ngAfterViewInit() {
    this.cargarMas();

    this.intervalo = setInterval(() => this.tick.update(t => t + 1), this.intervaloCarruselMs);

    const el = document.querySelector('mat-sidenav-content');
    if (!el) return;

    this.sidenavContent = el;
    this.scrollListener = () => this.checkScroll();
    this.sidenavContent.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
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

  imagenActual(grupo: GrupoPublico): string | null {
    const fallidas = this.imagenesFallidas();
    const disponibles = grupo.imagenUrls.filter(url => !fallidas.has(url));

    if (disponibles.length === 0) return null;

    // El desfase por grupo.id evita que todas las tarjetas cambien exactamente igual
    return disponibles[(this.tick() + grupo.id) % disponibles.length];
  }

  marcarImagenFallida(url: string) {
    this.imagenesFallidas.update(s => new Set(s).add(url));
  }

  verDetalle(id: number) {
    this.router.navigate(['/grupos', id]);
  }
}