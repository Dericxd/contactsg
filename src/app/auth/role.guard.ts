import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard por rol. Los roles permitidos se definen en la ruta con `data: { roles: [...] }`.
 * - Sin sesión: redirige a /login.
 * - Con sesión pero sin rol permitido: redirige a / (Home).
 */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  const allowedRoles = (route.data?.['roles'] as number[] | undefined) ?? [];
  if (allowedRoles.length === 0 || authService.hasRole(allowedRoles)) {
    return true;
  }

  return router.parseUrl('/');
};
