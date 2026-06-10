import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Producto } from '@core/models/producto';
import { ProductosService } from '@core/services/productos';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

//Esto de @Component le dice a angular que esto es un componente, y le dice cual es su html  cual su css y sus importaciones
@Component({
  selector: 'app-todos-los-productos', //Por si queremos llamar este HTML en otro HTML seria <app-todos-los-productos/> Reutilizar codigo
imports: [CommonModule, FormsModule],
  templateUrl: './todos-los-productos.html',
  styleUrl: './todos-los-productos.css',
})

export class TodosLosProductos {

  textoBusqueda: string = '';

  productos$!: Observable<Producto[]>;
  marcas$!: Observable<string[]>;
  categorias$!: Observable<string[]>;

  constructor(
    private productosService: ProductosService,
    private router: Router
  ) {
    this.productos$ = this.productosService.getAll();
    this.marcas$ = this.productosService.obtenerMarcas();
    this.categorias$ = this.productosService.obtenerCategorias();
  }

  verDetalle(id: number) {
    this.router.navigate(['/productos', id]);
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