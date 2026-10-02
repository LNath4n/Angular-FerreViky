import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '@core/services/Cliente/ClientesService';
import { AlertaService } from '@core/services/Modals/ModalsService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Register',
  imports: [FormsModule],
  templateUrl: './Register.html',
  styleUrl: './Register.css',
})
export class Register {

  private clientesService = inject(ClientesService);
  private alerta = inject(AlertaService);
  private router = inject(Router);

  email = '';
  password = '';

  registro() {
    this.clientesService.create({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.alerta.exito('Ya puedes iniciar sesión.', '¡Cuenta creada!');
        },
        error: () => {
          this.alerta.error('No se pudo crear la cuenta.');
        }
      });
  }

  irLogin() {
    this.router.navigate(['/login']);
  }

  regresar() {
    this.router.navigate(['/']);
  }
}