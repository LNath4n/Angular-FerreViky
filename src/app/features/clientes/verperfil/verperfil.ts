import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/Auth/auth';
import { ClientesService } from '@core/services/Cliente/ClientesService';
import { AlertaService } from '@core/services/Modals/ModalsService';
import { ClienteEditarRequest, ClientePublico } from '@core/models/Cliente/clienteModels';
import { LucideUser } from '@lucide/angular';

@Component({
  selector: 'app-verperfil',
  imports: [FormsModule, LucideUser],
  styleUrl: './verperfil.css',
  templateUrl: './verperfil.html',
})
export class Verperfil implements OnInit, OnDestroy {
  private clientesService = inject(ClientesService);
  private authService = inject(AuthService);
  private alerta = inject(AlertaService);
  private router = inject(Router);

  perfil = signal<ClientePublico | null>(null);
  cargando = signal(true);
  guardando = signal(false);
  procesandoFoto = signal(false);
  fotoVistaPrevia = signal<string | null>(null);
  confirmandoFoto = signal(false);
  private fotoPendiente: File | null = null;
  private urlFotoTemporal: string | null = null;
  private readonly maximoFotoBytes = 5 * 1024 * 1024;

  email = signal('');
  nombre = signal('');
  telefono = signal('');
  passwordVieja = signal('');
  passwordNueva = signal('');

  ngOnInit() {
    this.obtenerPerfil();
  }

  ngOnDestroy() {
    this.liberarVistaPrevia();
  }

  obtenerPerfil() {
    this.cargando.set(true);
    this.clientesService.obtenerPerfil().subscribe({
      next: perfil => {
        this.perfil.set(perfil);
        this.email.set(perfil.email);
        this.nombre.set(perfil.nombre);
        this.telefono.set(perfil.telefono);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.alerta.error('No se pudo cargar tu perfil.');
      }
    });
  }

  guardarCambios() {
    const perfilActual = this.perfil();
    if (!perfilActual) return;

    const request: ClienteEditarRequest = {};
    if (this.email() !== perfilActual.email) request.email = this.email();
    if (this.nombre() !== perfilActual.nombre) request.nombre = this.nombre();
    if (this.telefono() !== perfilActual.telefono) request.telefono = this.telefono();

    if (this.passwordNueva()) {
      if (!this.passwordVieja()) {
        this.alerta.advertencia('Ingresa tu contraseña actual para cambiarla.');
        return;
      }
      request.passwordVieja = this.passwordVieja();
      request.passwordNueva = this.passwordNueva();
    }

    if (Object.keys(request).length === 0) {
      this.alerta.advertencia('No hay cambios para guardar.');
      return;
    }

    this.guardando.set(true);
    this.clientesService.editarPerfil(request).subscribe({
      next: perfil => {
        this.perfil.set(perfil);
        this.email.set(perfil.email);
        this.nombre.set(perfil.nombre);
        this.telefono.set(perfil.telefono);
        this.passwordVieja.set('');
        this.passwordNueva.set('');
        this.guardando.set(false);
        this.alerta.exito('Tu perfil se actualizó correctamente.');
      },
      error: () => {
        this.guardando.set(false);
        this.alerta.error('No se pudieron guardar los cambios.');
      }
    });
  }

  seleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    input.value = '';
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.alerta.error('La foto debe estar en formato JPG o PNG.');
      return;
    }
    if (file.size > this.maximoFotoBytes) {
      this.alerta.error('La foto no puede superar los 5 MB.');
      return;
    }

    this.liberarVistaPrevia();
    this.fotoPendiente = file;
    this.urlFotoTemporal = URL.createObjectURL(file);
    this.fotoVistaPrevia.set(this.urlFotoTemporal);
    this.confirmandoFoto.set(true);
    this.alerta.solicitarConfirmacion(
      'Confirmar foto',
      '¿Quieres usar esta foto de perfil?',
      'Sí, cambiar foto'
    ).then(confirmada => {
      this.confirmandoFoto.set(false);
      if (confirmada) {
        this.subirFotoPendiente();
      } else {
        this.limpiarFotoPendiente();
      }
    });
  }

  private subirFotoPendiente() {
    const file = this.fotoPendiente;
    if (!file) return;

    this.procesandoFoto.set(true);
    this.clientesService.subirFoto(file).subscribe({
      next: perfil => {
        this.perfil.set(perfil);
        this.procesandoFoto.set(false);
        this.limpiarFotoPendiente();
        this.alerta.exito('Tu foto de perfil se actualizó.');
      },
      error: () => {
        this.procesandoFoto.set(false);
        this.limpiarFotoPendiente();
        this.alerta.error('No se pudo subir la foto de perfil.');
      }
    });
  }

  quitarFoto() {
    this.procesandoFoto.set(true);
    this.clientesService.quitarFoto().subscribe({
      next: perfil => {
        this.perfil.set(perfil);
        this.procesandoFoto.set(false);
        this.alerta.exito('Se quitó tu foto de perfil.');
      },
      error: () => {
        this.procesandoFoto.set(false);
        this.alerta.error('No se pudo quitar la foto de perfil.');
      }
    });
  }

  desactivarCuenta() {
    this.alerta.solicitarConfirmacion(
      'Desactivar cuenta',
      '¿Seguro que quieres desactivar tu cuenta? Tendrás que iniciar sesión nuevamente.',
      'Desactivar cuenta'
    ).then(confirmada => {
      if (!confirmada) return;

      this.clientesService.desactivarCuenta().subscribe({
        next: () => {
          this.authService.clearToken();
          this.alerta.exito('Tu cuenta se desactivó correctamente.');
          this.router.navigate(['/login']);
        },
        error: () => this.alerta.error('No se pudo desactivar tu cuenta.')
      });
    });
  }

  private limpiarFotoPendiente() {
    this.fotoPendiente = null;
    this.fotoVistaPrevia.set(null);
    this.liberarVistaPrevia();
  }

  private liberarVistaPrevia() {
    if (!this.urlFotoTemporal) return;
    URL.revokeObjectURL(this.urlFotoTemporal);
    this.urlFotoTemporal = null;
  }
}
