import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucidePencil,
  LucideTrash2,
  LucideSearch,
  LucideChevronLeft,
  LucideChevronRight,
} from '@lucide/angular';
import { Producto, ProductoRequest } from '@core/models/Producto/productoModels';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { ProductoAdminService } from '@core/models/Producto/ProductoAdminService';
import { AlertaService } from '@core/services/Modals/ModalsService';
import { ComponenteConCambios } from '@core/guard/cambios-sin-guardar-guard';

@Component({
  imports: [
    FormsModule,
    LucidePencil,
    LucideTrash2,
    LucideSearch,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  selector: 'app-administrar-productos',
  styleUrl: './administrar-productos.css',
  templateUrl: './administrar-productos.html',
})
export class AdministrarProductos implements OnInit, ComponenteConCambios {
  private productosService = inject(ProductosService);
  private adminService = inject(ProductoAdminService);
  private alerta = inject(AlertaService);

  productos = signal<Producto[]>([]);
  editandoId = signal<number | null>(null);

  form: ProductoRequest = { clave: '' };
  private inicial = JSON.stringify(this.form);

  // --- Búsqueda y paginación 
  private readonly tamanoPagina = 5;
  textoBusqueda = '';
  paginaActual = signal(0); // base 0
  totalPaginas = signal(1);
  // Ventana de 5 botones alrededor de la página actual
  paginas = computed(() => {
    const total = this.totalPaginas();
    const ventana = 5;
    let inicio = Math.max(0, this.paginaActual() - Math.floor(ventana / 2));
    const fin = Math.min(total, inicio + ventana);
    inicio = Math.max(0, fin - ventana);
    return Array.from({ length: fin - inicio }, (_, i) => inicio + i);
  });


  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.productosService
      .buscar({ q: this.textoBusqueda }, this.paginaActual(), this.tamanoPagina)
      .subscribe({
        next: res => {
          // Si se borro el último de la última página, retrocede una
          if (res.content.length === 0 && this.paginaActual() > 0) {
            this.irAPagina(this.paginaActual() - 1);
            return;
          }
          this.productos.set(res.content);
          this.totalPaginas.set(Math.max(res.totalPages, 1));
        },
        error: err => this.mostrarError(err, 'No se pudieron cargar los productos'),
      });
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.buscar();
  }


  buscar() {
    this.paginaActual.set(0);
    this.cargar();
  }


  irAPagina(pagina: number) {
    if (pagina < 0 || pagina >= this.totalPaginas()) return;
    this.paginaActual.set(pagina);
    this.cargar();
  }

  guardar() {
    const id = this.editandoId();
    const peticion = id !== null
      ? this.adminService.editar(id, this.form)
      : this.adminService.crear(this.form);

    peticion.subscribe({
      next: () => {
        this.alerta.exito(id !== null ? 'Producto actualizado.' : 'Producto creado.');
        this.cancelar();
        this.cargar();
      },
      error: err => this.mostrarError(err, 'No se pudo guardar el producto'),
    });
  }

  editar(p: Producto) {
    this.adminService.obtener(p.id).subscribe({
      next: ({ id, ...datos }) => {
        this.editandoId.set(id);
        this.reiniciarForm(datos);
      },
      error: err => this.mostrarError(err, 'No se pudo cargar el producto'),
    });
  }

  borrar(id: number) {
    if (!confirm('¿Borrar producto?')) return;
    this.adminService.borrar(id).subscribe({
      next: () => {
        this.alerta.exito('Producto borrado.');
        this.cargar();
      },
      error: err => this.mostrarError(err, 'No se pudo borrar el producto'),
    });
  }

  cancelar() {
    this.editandoId.set(null);
    this.reiniciarForm({ clave: '' });
  }

  hayCambiosSinGuardar(): boolean {
    return JSON.stringify(this.form) !== this.inicial;
  }

  private reiniciarForm(valor: ProductoRequest) {
    this.form = valor;
    this.inicial = JSON.stringify(valor);
  }

  private mostrarError(err: any, mensajeDefault: string) {
    this.alerta.error(typeof err.error === 'string' ? err.error : mensajeDefault);
  }


}