import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
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
import { ProductoAdminService } from '@core/services/Producto/ProductoAdminService';
import { AlertaService } from '@core/services/Modals/ModalsService';
import { ComponenteConCambios } from '@core/guard/cambios-sin-guardar-guard';
import { switchMap, of, catchError, throwError } from 'rxjs';

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
export class AdministrarProductos implements OnInit, OnDestroy, ComponenteConCambios {
  private productosService = inject(ProductosService);
  private adminService = inject(ProductoAdminService);
  private alerta = inject(AlertaService);

  productos = signal<Producto[]>([]);
  editandoId = signal<number | null>(null);

  form: ProductoRequest = { clave: '' };
  private inicial = JSON.stringify(this.form);

  // --- Imagen ---
  private readonly maxBytesImagen = 5 * 1024 * 1024; // igual que spring.servlet.multipart.max-file-size
  archivoImagen: File | null = null;
  vistaPrevia = signal<string | null>(null); // URL actual del producto o blob local
  inputKey = signal(0);                      // cambia para recrear el <input type="file"> y limpiarlo
  private blobUrl: string | null = null;

  // --- Búsqueda y paginación ---
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

  ngOnDestroy() {
    this.liberarBlob();
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

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;

    if (archivo && !archivo.type.startsWith('image/')) {
      this.alerta.error('El archivo debe ser una imagen.');
      input.value = '';
      return;
    }
    if (archivo && archivo.size > this.maxBytesImagen) {
      this.alerta.error('La imagen no debe pasar de 5 MB.');
      input.value = '';
      return;
    }

    this.liberarBlob();
    this.archivoImagen = archivo;
    if (archivo) {
      this.blobUrl = URL.createObjectURL(archivo);
      this.vistaPrevia.set(this.blobUrl);
    }
  }

  guardar() {
    const id = this.editandoId();
    const archivo = this.archivoImagen;

    const guardarDatos$ = id !== null
      ? this.adminService.editar(id, this.form)
      : this.adminService.crear(this.form);

    guardarDatos$.pipe(
      switchMap(producto => {
        if (!archivo) return of(null);

        return this.adminService.subirImagen(producto.id, archivo).pipe(
          catchError(err => {
            // El producto ya existe: pasa a modo edición para que reintentar no lo duplique
            this.editandoId.set(producto.id);
            this.inicial = JSON.stringify(this.form);
            this.cargar();
            this.alerta.advertencia('El producto se guardó, pero la imagen no se pudo subir. Vuelve a intentarlo.');
            return throwError(() => err);
          })
        );
      })
    ).subscribe({
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
      next: ({ id, imagenUrl, ...datos }) => {
        this.editandoId.set(id);
        this.reiniciarForm(datos);
        this.reiniciarImagen(imagenUrl);
      },
      error: err => this.mostrarError(err, 'No se pudo cargar el producto'),
    });
  }

  borrar(id: number) {
    if (!confirm('¿Borrar producto?')) return;
    this.adminService.borrar(id).subscribe({
      next: () => {
        this.alerta.exito('Producto borrado.');
        if (this.editandoId() === id) this.cancelar();
        this.cargar();
      },
      error: err => this.mostrarError(err, 'No se pudo borrar el producto'),
    });
  }

  cancelar() {
    this.editandoId.set(null);
    this.reiniciarForm({ clave: '' });
    this.reiniciarImagen(null);
  }

  hayCambiosSinGuardar(): boolean {
    return JSON.stringify(this.form) !== this.inicial || this.archivoImagen !== null;
  }

  private reiniciarForm(valor: ProductoRequest) {
    this.form = valor;
    this.inicial = JSON.stringify(valor);
  }

  private reiniciarImagen(urlActual: string | null) {
    this.liberarBlob();
    this.archivoImagen = null;
    this.vistaPrevia.set(urlActual);
    this.inputKey.update(k => k + 1); // recrea el input y borra el nombre del archivo
  }

  private liberarBlob() {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = null;
    }
  }

  private mostrarError(err: any, mensajeDefault: string) {
    this.alerta.error(typeof err.error === 'string' ? err.error : mensajeDefault);
  }
}