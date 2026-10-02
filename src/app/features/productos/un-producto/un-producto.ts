import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LucidePackage, LucideArrowLeft } from '@lucide/angular';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { AuthService } from '@core/services/Auth/auth';
import { CarritosService } from '@core/services/Carrito/CarritosService';
import { AlertaService } from '@core/services/Modals/ModalsService';

@Component({
  selector: 'app-un-producto',
  imports: [CommonModule, LucidePackage, LucideArrowLeft],
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

  id$ = this.route.paramMap.pipe(
    map(params => Number(params.get('id')))
  );

  producto$ = this.id$.pipe(
    switchMap(id => this.productosService.getById(id))
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

  regresar() {
    this.router.navigate(['/productos']);
  }
}