import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const API_BASE = 'http://localhost:3000';
const LOGIN_URL = `${API_BASE}/api/auth/login`;

/**
 * Agrega el token JWT a todas las peticiones hacia el backend.
 * Si el backend responde 401/403 (token vencido o inválido), cierra la sesión y envía al login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isApiRequest = req.url.startsWith(API_BASE);
  const isLoginRequest = req.url.startsWith(LOGIN_URL);
  const token = authService.getToken();

  if (isApiRequest && !isLoginRequest && token && !req.headers.has('Authorization')) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isApiRequest && !isLoginRequest && (error.status === 401 || error.status === 403)) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
