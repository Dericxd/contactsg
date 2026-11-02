import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap, shareReplay, catchError } from 'rxjs';
import {
  AdminUser,
  MyAccess,
  PermissionChange,
  UserPermissionMatrix
} from '../interface/permission-interface';

const API_BASE = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private http = inject(HttpClient);

  // Señal principal de acceso
  access = signal<MyAccess | null>(null);

  // Computados
  menu = computed(() => this.access()?.menu ?? []);
  isAdmin = computed(() => this.access()?.isAdmin ?? false);
  userRole = computed(() => this.access()?.role ?? null);

  private loadRequest$: Observable<MyAccess> | null = null;

  /**
   * Carga los permisos efectivos y menú desde el backend.
   */
  load(): Observable<MyAccess> {
    this.loadRequest$ = this.http.get<MyAccess>(`${API_BASE}/me/permissions`).pipe(
      tap((res) => {
        this.access.set(res);
        this.loadRequest$ = null;
      }),
      shareReplay(1),
      catchError((err) => {
        this.loadRequest$ = null;
        this.clear();
        throw err;
      })
    );
    return this.loadRequest$;
  }

  /**
   * Asegura que los permisos estén cargados en memoria.
   */
  ensureLoaded(): Observable<MyAccess | null> {
    if (this.access()) {
      return of(this.access());
    }
    if (this.loadRequest$) {
      return this.loadRequest$;
    }
    return this.load().pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Comprueba si el usuario tiene un permiso específico.
   */
  has(slug: string): boolean {
    const acc = this.access();
    if (!acc) return false;
    if (acc.isAdmin) return true;
    return acc.permissions.includes(slug);
  }

  /**
   * Comprueba si tiene al menos uno de los permisos dados.
   */
  hasAny(slugs: string[]): boolean {
    if (slugs.length === 0) return true;
    return slugs.some((s) => this.has(s));
  }

  /**
   * Limpia el estado de permisos (logout).
   */
  clear(): void {
    this.access.set(null);
    this.loadRequest$ = null;
  }

  // -------------------------------------------------------------
  // MÉTODOS DE ADMINISTRADOR
  // -------------------------------------------------------------

  getAdminUsers(search?: string): Observable<AdminUser[]> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<AdminUser[]>(`${API_BASE}/admin/users`, { params });
  }

  getUserPermissionMatrix(userId: number): Observable<UserPermissionMatrix> {
    return this.http.get<UserPermissionMatrix>(`${API_BASE}/admin/users/${userId}/permissions`);
  }

  saveUserPermissions(userId: number, changes: PermissionChange[]): Observable<any> {
    return this.http.put<any>(`${API_BASE}/admin/users/${userId}/permissions`, { changes });
  }
}
