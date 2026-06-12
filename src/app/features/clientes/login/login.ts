import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '@core/services/Cliente/ClientesService';
import { AuthService } from '@core/services/Auth/auth';
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
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  email = '';
  password = '';
  mensaje = '';

  login() {
    this.clientesService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.authService.setUserId(res.id);
          this.mensaje = 'Login exitoso';
          this.irProductos();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.mensaje = err.error;
          this.cdr.detectChanges();
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