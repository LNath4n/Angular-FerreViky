import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Producto } from '@core/models/producto';
import { ProductosService } from '@core/services/productos';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
@Component({
  selector: 'app-un-producto',
  imports: [CommonModule],
  templateUrl: './un-producto.html',
  styleUrl: './un-producto.css',
})
export class UnProducto {
  producto$!: Observable<Producto>; //! Promete inicializacion
  id$!: Observable<number>;
  constructor(
    private productosService: ProductosService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.id$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id')))
    ); //Usar suscriptores
    this.producto$ = this.id$.pipe(
      switchMap(id => this.productosService.getById(id))
    );
  }

  regresar() {
    this.router.navigate(['/productos']);
  }
}