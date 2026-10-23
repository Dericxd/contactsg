import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth/login';

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): number | null {
    if (!this.isAuthenticated()) return null;
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.role_id ?? null;
      } catch {
        return null;
      }
    }
    return null;
  }

  hasRole(allowedRoles: number[]): boolean {
    const role = this.getUserRole();
    return role !== null && allowedRoles.includes(role);
  }

  // Roles: 1 Administrador, 2 Supervisor, 3 Operador, 4 Consulta
  // Roles con acceso a Usuarios (trabajadores) y Lugar (ubicación)
  static readonly DIRECTORY_ROLES = [1, 2, 3, 4];
  // Roles con acceso a Línea de compañía
  static readonly COMPANY_LINE_ROLES = [1, 2, 3];
  // Roles con acceso a Nuevo usuario y Crear línea
  static readonly MANAGE_ROLES = [1, 2, 3];

  canViewDirectory(): boolean {
    return this.hasRole(AuthService.DIRECTORY_ROLES);
  }

  canViewCompanyLines(): boolean {
    return this.hasRole(AuthService.COMPANY_LINE_ROLES);
  }

  canManage(): boolean {
    return this.hasRole(AuthService.MANAGE_ROLES);
  }

  isAdminOrSupervisor(): boolean {
    return this.hasRole([1, 2]);
  }
}
