import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DepartmentsInterface } from '../interface/departments';
import { Place } from '../interface/place-interface';
import { PaginatedResponse } from '../interface/pagination-interface';

const API_BASE = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly http = inject(HttpClient);

  // Cache
  private departmentsCache: DepartmentsInterface[] | null = null;

  clearCache(): void {
    this.departmentsCache = null;
  }

  // Obtener departamentos con paginación desde el servidor
  getDepartmentsPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    place_id?: string | number
  ): Observable<PaginatedResponse<DepartmentsInterface>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    if (place_id && place_id !== 'todos') {
      params = params.set('place_id', place_id.toString());
    }

    return this.http.get<PaginatedResponse<DepartmentsInterface>>(
      `${API_BASE}/contacts/departments`,
      { params }
    );
  }

  // Obtener todos los departamentos activos (status = 1) sin paginar (para selects o uso general)
  getDepartments(): Observable<DepartmentsInterface[]> {
    return this.http.get<DepartmentsInterface[]>(`${API_BASE}/contacts/departments`);
  }

  // Crear un nuevo departamento
  createDepartment(department: DepartmentsInterface): Observable<any> {
    return this.http.post<any>(`${API_BASE}/contacts/departments`, department).pipe(
      tap(() => this.clearCache())
    );
  }

  // Modificar/Actualizar departamento
  updateDepartment(id: number, department: DepartmentsInterface): Observable<any> {
    return this.http.put<any>(`${API_BASE}/contacts/departments/${id}`, department).pipe(
      tap(() => this.clearCache())
    );
  }

  // Obtener lista de lugares para los select y filtros
  getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(`${API_BASE}/places`);
  }
}
