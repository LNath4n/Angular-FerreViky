import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '@core/services/clientes';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-Register',
  imports: [FormsModule],
  templateUrl: './Register.html',
  styleUrl: './Register.css',
})
export class Register {
  email = '';
  password = '';
  mensaje = '';

  constructor(private clientesService: ClientesService, private cdr: ChangeDetectorRef
  ) { }

  registro() {
  this.clientesService.create({ email: this.email, password: this.password })
    .subscribe({
      next: (res) => {
        this.mensaje = `Cuenta creada! Tu id es: ${res.id}`;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mensaje = err.error;
        this.cdr.detectChanges();
      }
    });
}
}