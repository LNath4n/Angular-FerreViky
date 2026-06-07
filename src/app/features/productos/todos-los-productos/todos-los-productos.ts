import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Producto } from '@core/models/producto';
import { ProductosService } from '@core/services/productos';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-todos-los-productos',
  imports: [CommonModule],
  templateUrl: './todos-los-productos.html',
  styleUrl: './todos-los-productos.css',
})
export class TodosLosProductos implements OnInit {
  productos: Producto[] = [];

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.productosService.getAll().subscribe({
      next: (res) => {
        this.productos = res;
        this.cdr.detectChanges();  //Este FORZA a angular a checar los dstos
      },
      error: () => console.error('Error al cargar productos')
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/productos', id]);
  }

}