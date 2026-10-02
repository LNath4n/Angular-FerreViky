import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin, of } from 'rxjs';
import { GrupoPublico, Producto } from '@core/models/Producto/productoModels';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AuthService } from '@core/services/Auth/auth';
import { CarritosService } from '@core/services/Carrito/CarritosService';
import { AlertaService } from '@core/services/Modals/ModalsService';

@Component({
  selector: 'app-grupos-de-productos-individual',
  imports: [CommonModule],
  templateUrl: './grupos-de-productos-individual.html',
  styleUrl: './grupos-de-productos-individual.css',
})
export class GruposDeProductosIndividual {

  private productosService = inject(ProductosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private carritosService = inject(CarritosService);
  private alerta = inject(AlertaService);

  id$ = this.route.paramMap.pipe(
    map(params => Number(params.get('id')))
  );

  grupo$: Observable<GrupoPublico> = this.id$.pipe(
    switchMap(id => this.productosService.getGrupoById(id))
  );

  // Por cada productoId del grupo, hace getById en paralelo con forkJoin
  productos$: Observable<Producto[]> = this.grupo$.pipe(
    switchMap(grupo =>
      grupo.productoIds.length > 0
        ? forkJoin(grupo.productoIds.map(id => this.productosService.getById(id)))
        : of([] as Producto[])
    )
  );

  agregarAlCarrito(idProducto: number) {
    if (!this.authService.getToken()) {
      this.alerta.advertencia('Debes de iniciar sesion');

      return;
    }

    this.carritosService.agregar({ idProducto, cantidad: 1 })
      .subscribe({
        next: (res) => {
          this.alerta.exito('Se agregó correctamente al carrito.');
          console.log(res);
        },
        error: (err) => {
          console.error(err);
          this.alerta.error('Hubo algún error al agregar el producto.');
        }
      });
  }

  verDetalle(id: number) {
    this.router.navigate(['/productos', id]);
  }

  regresar() {
    this.router.navigate(['/grupos']);
  }
}