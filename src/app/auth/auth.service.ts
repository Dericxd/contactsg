import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { PermissionService } from '../Services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private permissionService = inject(PermissionService);
  private apiUrl = 'http://localhost:3000/api/auth/login';

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }),
      switchMap(() => this.permissionService.load())
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.permissionService.clear();
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

  // Delegaciones hacia PermissionService para comprobaciones reactivas
  canViewDirectory(): boolean {
    return this.permissionService.hasAny(['agenda.view', 'agenda.by-place']);
  }

  canViewCompanyLines(): boolean {
    return this.permissionService.has('phone-lines.view');
  }

  canViewDepartments(): boolean {
    return this.permissionService.has('departments.view');
  }

  canManage(): boolean {
    return this.permissionService.hasAny(['employees.create', 'phone-lines.create']);
  }

  canCreateStaff(): boolean {
    return this.permissionService.has('employees.create');
  }

  canEditStaff(): boolean {
    return this.permissionService.has('employees.update');
  }

  canDeleteStaff(): boolean {
    return this.permissionService.has('employees.delete');
  }

  canAssignRole(): boolean {
    return this.permissionService.has('employees.assign-role');
  }

  canRestoreStaff(): boolean {
    return this.permissionService.has('employees.restore');
  }

  isAdmin(): boolean {
    return this.permissionService.isAdmin();
  }

  isAdminOrSupervisor(): boolean {
    return this.permissionService.isAdmin() || this.permissionService.has('employees.delete');
  }
}
