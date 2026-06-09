import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '@core/services/clientes';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';
  password = '';
  mensaje = '';

  constructor(private clientesService: ClientesService, private cdr: ChangeDetectorRef, private router: Router
  ) { }

  login() {
  this.clientesService.login({ email: this.email, password: this.password })
    .subscribe({
      next: (res) => {
        this.mensaje = res;
        this.cdr.detectChanges();  
      },
      error: (err) => {
        this.mensaje = err.error;
        this.cdr.detectChanges();  
      }
    });
}


  regresar() {
    this.router.navigate(['/']);
  }
}