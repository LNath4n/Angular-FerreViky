import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/Auth/auth';
import { ClientesService } from '@core/services/Cliente/ClientesService';
import { AlertaService } from '@core/services/Modals/ModalsService';
import { ClienteEditarRequest, ClientePublico } from '@core/models/Cliente/clienteModels';

@Component({
  selector: 'app-verperfil',
  imports: [FormsModule],
  styleUrl: './verperfil.css',
  templateUrl: './verperfil.html',
})
export class Verperfil implements OnInit {
  private clientesService = inject(ClientesService);
  private authService = inject(AuthService);
  private alerta = inject(AlertaService);
  private router = inject(Router);

  perfil: ClientePublico | null = null;
  cargando = true;
  guardando = false;
  procesandoFoto = false;

  email = '';
  nombre = '';
  telefono = '';
  passwordVieja = '';
  passwordNueva = '';

  ngOnInit() {
    this.obtenerPerfil();
  }

  obtenerPerfil() {
    this.cargando = true;
    this.clientesService.obtenerPerfil().subscribe({
      next: perfil => {
        this.perfil = perfil;
        this.email = perfil.email;
        this.nombre = perfil.nombre;
        this.telefono = perfil.telefono;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.alerta.error('No se pudo cargar tu perfil.');
      }
    });
  }

  guardarCambios() {
    if (!this.perfil) return;

    const request: ClienteEditarRequest = {};
    if (this.email !== this.perfil.email) request.email = this.email;
    if (this.nombre !== this.perfil.nombre) request.nombre = this.nombre;
    if (this.telefono !== this.perfil.telefono) request.telefono = this.telefono;

    if (this.passwordNueva) {
      if (!this.passwordVieja) {
        this.alerta.advertencia('Ingresa tu contraseña actual para cambiarla.');
        return;
      }
      request.passwordVieja = this.passwordVieja;
      request.passwordNueva = this.passwordNueva;
    }

    if (Object.keys(request).length === 0) {
      this.alerta.advertencia('No hay cambios para guardar.');
      return;
    }

    this.guardando = true;
    this.clientesService.editarPerfil(request).subscribe({
      next: perfil => {
        this.perfil = perfil;
        this.email = perfil.email;
        this.nombre = perfil.nombre;
        this.telefono = perfil.telefono;
        this.passwordVieja = '';
        this.passwordNueva = '';
        this.guardando = false;
        this.alerta.exito('Tu perfil se actualizó correctamente.');
      },
      error: () => {
        this.guardando = false;
        this.alerta.error('No se pudieron guardar los cambios.');
      }
    });
  }

  seleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.procesandoFoto = true;
    this.clientesService.subirFoto(file).subscribe({
      next: perfil => {
        this.perfil = perfil;
        this.procesandoFoto = false;
        this.alerta.exito('Tu foto de perfil se actualizó.');
      },
      error: () => {
        this.procesandoFoto = false;
        this.alerta.error('No se pudo subir la foto de perfil.');
      }
    });
    input.value = '';
  }

  quitarFoto() {
    this.procesandoFoto = true;
    this.clientesService.quitarFoto().subscribe({
      next: perfil => {
        this.perfil = perfil;
        this.procesandoFoto = false;
        this.alerta.exito('Se quitó tu foto de perfil.');
      },
      error: () => {
        this.procesandoFoto = false;
        this.alerta.error('No se pudo quitar la foto de perfil.');
      }
    });
  }

  desactivarCuenta() {
    if (!confirm('¿Seguro que quieres desactivar tu cuenta?')) return;

    this.clientesService.desactivarCuenta().subscribe({
      next: () => {
        this.authService.clearToken();
        this.alerta.exito('Tu cuenta se desactivó correctamente.');
        this.router.navigate(['/login']);
      },
      error: () => this.alerta.error('No se pudo desactivar tu cuenta.')
    });
  }
}
