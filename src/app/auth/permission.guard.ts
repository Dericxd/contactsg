import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { PermissionService } from '../Services/permission.service';
import { map } from 'rxjs/operators';

/**
 * Guard para validar permisos efectivos por slug.
 * Rutas usan: data: { permissions: ['agenda.view'] }
 */
export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  const requiredPermissions = (route.data?.['permissions'] as string[] | undefined) ?? [];

  return permissionService.ensureLoaded().pipe(
    map((access) => {
      if (!access) {
        return router.parseUrl('/login');
      }
      if (requiredPermissions.length === 0 || permissionService.hasAny(requiredPermissions)) {
        return true;
      }
      return router.parseUrl('/');
    })
  );
};

/**
 * Guard exclusivo para Administrador.
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  return permissionService.ensureLoaded().pipe(
    map((access) => {
      if (!access) {
        return router.parseUrl('/login');
      }
      if (permissionService.isAdmin()) {
        return true;
      }
      return router.parseUrl('/');
    })
  );
};
