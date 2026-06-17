import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '@core/services/Cliente/ClientesService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Register',
  imports: [FormsModule],
  templateUrl: './Register.html',
  styleUrl: './Register.css',
})
export class Register {

  private clientesService = inject(ClientesService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  email = '';
  password = '';
  mensaje = '';

  registro() {
    this.clientesService.create({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.mensaje = `Cuenta creada!`;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.mensaje = `Error`;
          this.cdr.detectChanges();
        }
      });
  }

  regresar() {
    this.router.navigate(['/']);
  }
}