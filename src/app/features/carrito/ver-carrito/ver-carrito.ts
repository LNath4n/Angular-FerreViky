import { Component, inject } from '@angular/core';
import { CarritosService } from '@core/services/Carrito/CarritosService';
import { AuthService } from '@core/services/Auth/auth';
import { Carrito } from '@core/models/Carrito/carritoModels';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ver-carrito',
  imports: [CommonModule],
  templateUrl: './ver-carrito.html',
  styleUrl: './ver-carrito.css',
})
export class VerCarrito {
  private carritoService = inject(CarritosService);
  carrito$?: Observable<Carrito>;

  constructor() {
    this.carrito$ = this.carritoService.obtenerCarrito(); // GET /carrito sin id
  }
}

