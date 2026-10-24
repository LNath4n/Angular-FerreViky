import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideChevronLeft, LucideChevronRight, LucideSearch } from '@lucide/angular';
import { ProductoPublicoResponse } from '@core/models/Producto/productoModels';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { AlertaService } from '@core/services/Modals/ModalsService';
import { CodigosAdminService } from '@core/services/admin/CodigosAdminService/codigos-admin-service';

@Component({
  imports: [FormsModule, LucideChevronLeft, LucideChevronRight, LucideSearch],
  selector: 'app-administrar-codigos',
  styleUrl: './administrar-codigos.css',
  templateUrl: './administrar-codigos.html',
})
export class AdministrarCodigos implements OnInit {
  private readonly productosService = inject(ProductosService);
  private readonly codigosAdminService = inject(CodigosAdminService);
  private readonly alerta = inject(AlertaService);
  private readonly tamanoPagina = 5;

  readonly productos = signal<ProductoPublicoResponse[]>([]);
  readonly productoSeleccionado = signal<ProductoPublicoResponse | null>(null);
  readonly cargandoProductos = signal(false);
  readonly cargandoCodigos = signal(false);
  readonly paginaActual = signal(0);
  readonly totalPaginas = signal(1);
  readonly paginas = computed(() => {
    const total = this.totalPaginas();
    const ventana = 5;
    let inicio = Math.max(0, this.paginaActual() - Math.floor(ventana / 2));
    const fin = Math.min(total, inicio + ventana);
    inicio = Math.max(0, fin - ventana);
    return Array.from({ length: fin - inicio }, (_, i) => inicio + i);
  });

  textoBusqueda = '';
  textoCodigos = '';

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.consultarProductos(this.paginaActual());
  }

  private consultarProductos(pagina: number) {
    this.cargandoProductos.set(true);
    this.productosService.buscar({ q: this.textoBusqueda }, pagina, this.tamanoPagina).subscribe({
      next: respuesta => {
        if (respuesta.content.length === 0 && pagina > 0) {
          this.paginaActual.set(pagina - 1);
          this.consultarProductos(pagina - 1);
          return;
        }
        this.productos.set(respuesta.content);
        this.totalPaginas.set(Math.max(respuesta.totalPages, 1));
        this.cargandoProductos.set(false);
      },
      error: error => {
        this.cargandoProductos.set(false);
        this.mostrarError(error, 'No se pudieron cargar los productos');
      },
    });
  }

  buscarProductos() {
    this.paginaActual.set(0);
    this.consultarProductos(0);
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.buscarProductos();
  }

  irAPagina(pagina: number) {
    if (pagina < 0 || pagina >= this.totalPaginas()) return;
    this.paginaActual.set(pagina);
    this.consultarProductos(pagina);
  }

  seleccionarProducto(producto: ProductoPublicoResponse) {
    this.productoSeleccionado.set(producto);
  }

  cantidadCodigosIngresados(): number {
    return this.textoCodigos.split(/\r?\n/).filter(codigo => codigo.trim().length > 0).length;
  }

  cargarCodigos() {
    const producto = this.productoSeleccionado();
    const codigos = this.textoCodigos
      .split(/\r?\n/)
      .map(codigo => codigo.trim())
      .filter(codigo => codigo.length > 0);

    if (!producto) {
      this.alerta.error('Selecciona un producto antes de cargar códigos.');
      return;
    }
    if (codigos.length === 0) {
      this.alerta.error('Ingresa al menos un código.');
      return;
    }
    if (codigos.length > 500) {
      this.alerta.error('Puedes cargar un máximo de 500 códigos por solicitud.');
      return;
    }

    this.cargandoCodigos.set(true);
    this.codigosAdminService.cargarCodigos(producto.id, { codigos }).subscribe({
      next: respuesta => {
        this.cargandoCodigos.set(false);
        this.textoCodigos = '';
        this.alerta.exito(`${respuesta.guardados} códigos cargados para ${producto.nombre}.`);
      },
      error: error => {
        this.cargandoCodigos.set(false);
        this.mostrarError(error, 'No se pudieron cargar los códigos');
      },
    });
  }

  private mostrarError(error: unknown, mensajeDefault: string) {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.trim()) {
        this.alerta.error(error.error);
        return;
      }
      if (error.status === 400) {
        this.alerta.error('La solicitud no es válida. Revisa los códigos e intenta de nuevo.');
        return;
      }
      if (error.status === 404) {
        this.alerta.error('No se encontró el producto seleccionado.');
        return;
      }
      if (error.status === 409) {
        this.alerta.error('Uno o más códigos ya existen. No se guardó ninguno.');
        return;
      }
    }
    this.alerta.error(mensajeDefault);
  }
}
