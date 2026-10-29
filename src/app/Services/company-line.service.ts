import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CompanyLineInterface } from '../interface/company-line-interface';
import { Observable, tap } from 'rxjs';
import { PaginatedResponse } from '../interface/pagination-interface';

const apiUrl = 'http://localhost:3000/company-lines';

@Injectable({
  providedIn: 'root'
})
export class CompanyLine {
  private readonly http = inject(HttpClient);
  private queryCacheCompanyLine = new Map<string, CompanyLineInterface[]>();
  private queryCachePlace = new Map<string, CompanyLineInterface[]>();

  //? Limpiar cache en memoria
  clearCache() {
    this.queryCacheCompanyLine.clear();
    this.queryCachePlace.clear();
  }

  //? los company-lines con paginación desde el servidor
  getCompanyLinesPaginated(
    page: number = 1,
    limit: number = 10,
    operator?: string,
    search?: string
  ): Observable<PaginatedResponse<CompanyLineInterface>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (operator && operator.toLowerCase() !== 'todos') {
      params = params.set('operator', operator.trim());
    }

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PaginatedResponse<CompanyLineInterface>>(apiUrl, { params });
  }

  //? los company-lines sin paginar (compatibilidad)
  getCompanyLines(): Observable<CompanyLineInterface[]> {
    return this.http.get<CompanyLineInterface[]>(apiUrl);
  }

  //? crear company-line
  addCompanyLine(companyLine: CompanyLineInterface): Observable<CompanyLineInterface> {
    return this.http.post<CompanyLineInterface>(`${apiUrl}/create-line`, companyLine).pipe(
      tap(() => this.clearCache())
    );
  }

  //? actualizar company-line
  updateCompanyLine(id: number, companyLine: CompanyLineInterface): Observable<CompanyLineInterface> {
    return this.http.put<CompanyLineInterface>(`${apiUrl}/${id}`, companyLine).pipe(
      tap(() => this.clearCache())
    );
  }

  //! borrar company-line
  deleteCompanyLine(id: number): Observable<CompanyLineInterface> {
    return this.http.delete<CompanyLineInterface>(`${apiUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }
}
