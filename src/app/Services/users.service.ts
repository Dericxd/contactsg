import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/User';

const apiUrl = 'http://localhost:3000/contacts/staff';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly http = inject(HttpClient);
  private queryCacheUser = new Map<string, User[]>();

  //? los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(apiUrl);
  }

  //? crear
  addUser(user: User): Observable<User> {
    return this.http.post<User>(apiUrl, user);
  }

  //? actualizar
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${apiUrl}/${id}`, user);
  }

  //! borrar
  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${apiUrl}/${id}`);
  }

  //? buscar usuarios por query
  searchUsers(query: string): Observable<User[]> {

    query = query.toLocaleLowerCase();

    if (this.queryCacheUser.has(query)) {
      return of (this.queryCacheUser.get(query) ?? []);
    }

    console.log('Searching users with query:', query);

    return this.http.get<User[]>(`${apiUrl}/staff/${ query }`)
      .pipe(
        map((resp) => UserInterface(resp)),
        tap((users) => this.queryCacheUser.set(query, users)),
        delay(2500),
        catchError((error) => {
          console.error('Error searching users:', error);
          return throwError(
            () => new Error('Error searching users')
          );
        })
      );
  }
}

function UserInterface(resp: User[]): any {
  throw new Error('Function not implemented.');
}

