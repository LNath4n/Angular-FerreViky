import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@core/services/Auth/auth';
import { AlertaService } from '@core/services/Modals/ModalsService';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const alerta = inject(AlertaService);

  const esRutaAuth = req.url.includes('/auth');
  const token = auth.getToken();

  const authReq = token && !esRutaAuth
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // auth.isLoggedIn() evita mostrar el mensaje varias veces
      // si fallan varias requests a la vez
      if (err.status === 401 && !esRutaAuth && auth.isLoggedIn()) {
        auth.clearToken();
        alerta.advertencia(
          'Tu sesión expiró, inicia sesión de nuevo por favor.',
          'Sesión expirada'
        );
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};