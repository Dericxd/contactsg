import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/User';
import { Place } from '../interface/place-interface';
import { AuthService } from '../auth/auth.service';
import { PaginatedResponse } from '../interface/pagination-interface';

const apiUrl = 'http://localhost:3000/contacts';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private queryCacheUser = new Map<string, User[]>();
  private queryCachePlace = new Map<string, User[]>();

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  //? Limpiar cache en memoria
  clearCache() {
    this.queryCacheUser.clear();
    this.queryCachePlace.clear();
  }

  //? los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(apiUrl);
  }

  //? crear usuario
  addUser(user: User): Observable<User> {
    return this.http.post<User>(apiUrl, user, this.getAuthHeaders()).pipe(
      tap(() => this.clearCache())
    );
  }

  //? actualizar usuario
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${apiUrl}/${id}`, user, this.getAuthHeaders()).pipe(
      tap(() => this.clearCache())
    );
  }

  //! borrar usuario (soft delete)
  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${apiUrl}/${id}`, this.getAuthHeaders()).pipe(
      tap(() => this.clearCache())
    );
  }

  //? restaurar usuario eliminado (soft delete reverse)
  restoreUser(id: number): Observable<any> {
    return this.http.post<any>(`${apiUrl}/restore/${id}`, {}, this.getAuthHeaders()).pipe(
      tap(() => this.clearCache())
    );
  }

  //? buscar usuarios por query
  searchUsers(query: string, includeDeleted: boolean = false): Observable<User[]> {
    query = query.toLocaleLowerCase(); 
    const cacheKey = `${query}_del_${includeDeleted}`;

    if (this.queryCacheUser.has(cacheKey)) {
      return of(this.queryCacheUser.get(cacheKey) ?? []);
    }

    let params = new HttpParams();
    if (includeDeleted) {
      params = params.set('include_deleted', 'true');
    }

    return this.http.get<User[]>(`${apiUrl}/staff/search/${encodeURIComponent(query)}`, {
      ...this.getAuthHeaders(),
      params
    }).pipe(
      map((resp: User[]) => resp),
      tap((users) => this.queryCacheUser.set(cacheKey, users)),
      catchError((error) => {
        console.error('Error searching users:', error);
        return throwError(
          () => new Error('Error searching users')
        );
      })
    );
  }

  //? buscar usuario por lugar 
  searchByPlace(place: Place): Observable<User[]> {
    const placeName = place.name;
    const cacheKey = placeName.toLocaleLowerCase();
    const url = `${apiUrl}/places/${encodeURIComponent(placeName)}`;

    if (this.queryCachePlace.has(cacheKey)) {
      return of(this.queryCachePlace.get(cacheKey) ?? []);
    }

    return this.http.get<User[]>(url, this.getAuthHeaders()).pipe(
      map((res: User[]) => res),
      tap((users) => this.queryCachePlace.set(cacheKey, users)),
      catchError((error) => {
        console.log(error);
        return throwError(
          () => Error(`No se encontro ningun usuario en: ${placeName}`)
        );
      })
    );
  }

  //? buscar usuario por lugar con paginación desde el servidor
  searchByPlacePaginated(place: Place, page: number = 1, limit: number = 10, search?: string): Observable<PaginatedResponse<User>> {
    const placeName = place.name;
    const url = `${apiUrl}/places/${encodeURIComponent(placeName)}`;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PaginatedResponse<User>>(url, {
      ...this.getAuthHeaders(),
      params
    }).pipe(
      catchError((error) => {
        console.error('Error buscando personal por lugar:', error);
        return throwError(() => new Error(`No se encontró personal en: ${placeName}`));
      })
    );
  }

  //? obtener departamentos
  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/departments');
  }

  //? obtener lugares
  getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>('http://localhost:3000/places');
  }

  //? crear contacto completo
  createFullContact(contact: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/create-full`, contact, this.getAuthHeaders()).pipe(
      tap(() => this.clearCache())
    );
  }

  //? actualizar contacto completo
  updateFullContact(id: number, contact: any): Observable<any> {
    return this.http.put<any>(`${apiUrl}/update-full/${id}`, contact, this.getAuthHeaders()).pipe(
      tap(() => this.clearCache())
    );
  }

  //? obtener lineas disponibles
  getCompanyLinesAvailable(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}/company-lines/available`, this.getAuthHeaders());
  }
}
