import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '@core/models/producto';
import { ProductosService } from '@core/services/productos';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-un-producto',
  imports: [CommonModule],
  templateUrl: './un-producto.html',
  styleUrl: './un-producto.css',
})
export class UnProducto implements OnInit {
  producto: Producto | null = null;

  constructor(
    private productosService: ProductosService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef  // ← agregamos esto
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productosService.getById(id).subscribe({
      next: (res) => {
        this.producto = res;
        this.cdr.detectChanges();  // ← forzamos la actualización
      },
      error: () => console.error('Producto no encontrado')
    });
  }

  regresar() {
    this.router.navigate(['/productos']);
  }
}