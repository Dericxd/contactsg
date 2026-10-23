import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CompanyLineInterface } from '../interface/company-line-interface';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';


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

    //? los company-lines
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
