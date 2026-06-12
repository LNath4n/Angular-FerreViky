import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Carrito } from '@core/models/Carrito/carritoModels';
import { ProductosService } from '@core/services/Producto/ProductosService';
import { CarritosService } from '@core/services/Carrito/CarritosService';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AuthService } from '@core/services/Auth/auth';
@Component({
  selector: 'app-todos-los-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './todos-los-productos.html',
  styleUrl: './todos-los-productos.css',
})
export class TodosLosProductos {

  private productosService = inject(ProductosService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private carritosService = inject(CarritosService);

  textoBusqueda: string = '';

  productos$ = this.productosService.getAll();
  marcas$ = this.productosService.obtenerMarcas();
  categorias$ = this.productosService.obtenerCategorias();
  userId = this.authService.getUserIdSignal();

  verDetalle(id: number) {
    this.router.navigate(['/productos', id]);
  }

  agregarAlCarrito(idProducto: number) {
    const idCliente = this.userId();

    if (!idCliente) {
      this.router.navigate(['/login']);
      return;
    }

    this.carritosService.agregar({ idCliente, idProducto, cantidad: 1 })
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => console.error(err)
      });
  }

  buscarPorMarca() {
    const texto = this.textoBusqueda.toLowerCase().trim();

    this.productos$ = this.productosService.getAll().pipe(
      map(productos =>
        productos.filter(producto =>
          producto.marca.toLowerCase().includes(texto) ||
          producto.categoria.toLowerCase().includes(texto)
        )
      )
    );
  }
}