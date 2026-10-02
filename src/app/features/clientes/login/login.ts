import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '@core/services/Cliente/ClientesService';
import { AuthService } from '@core/services/Auth/auth';
import { AlertaService } from '@core/services/Modals/ModalsService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private clientesService = inject(ClientesService);
  private authService = inject(AuthService);
  private alerta = inject(AlertaService);
  private router = inject(Router);

  email = '';
  password = '';

  login() {
    this.clientesService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.authService.setToken(res.token);
          this.alerta.exito('Bienvenido de nuevo.', 'Login exitoso');
          this.irProductos();
        },
        error: () => {
          this.alerta.error('Credenciales incorrectas.');
        }
      });
  }

  irProductos() {
    this.router.navigate(['/productos']);
  }

  regresar() {
    this.router.navigate(['/']);
  }
}