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
  private authService = inject(AuthService);

  userId = this.authService.getUserIdSignal();

  carrito$?: Observable<Carrito>;

  constructor() {
    const id = this.userId();

    if (id !== null) {
      this.carrito$ = this.carritoService.obtenerPorId(id);
    }
  }
}


