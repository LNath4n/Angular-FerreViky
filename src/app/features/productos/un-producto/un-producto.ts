import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Producto } from '@core/models/Producto/productoModels';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AuthService } from '@core/services/Auth/auth';
import { CarritosService } from '@core/services/Carrito/CarritosService';
@Component({
  selector: 'app-un-producto',
  imports: [CommonModule],
  templateUrl: './un-producto.html',
  styleUrl: './un-producto.css',
})
export class UnProducto {

  private productosService = inject(ProductosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private carritosService = inject(CarritosService);

  mensaje = '';

  id$ = this.route.paramMap.pipe(
    map(params => Number(params.get('id')))
  );

  producto$ = this.id$.pipe(
    switchMap(id => this.productosService.getById(id))
  );

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

  regresar() {
    this.router.navigate(['/productos']);
  }
}