import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/User';
import { Place } from '../interface/place-interface';

const apiUrl = 'http://localhost:3000/contacts';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly http = inject(HttpClient);
  private queryCacheUser = new Map<string, User[]>();
  private queryCachePlace = new Map<string, User[]>();

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

    return this.http.get<User[]>(`${apiUrl}/staff/search/${ query }`)
      .pipe(
        map((resp: User[]) => resp),
        tap((users) => this.queryCacheUser.set(query, users)),
        delay(300),
        catchError((error) => {
          console.error('Error searching users:', error);
          return throwError(
            () => new Error('Error searching users')
          );
        })
      );
  }

  //? buscar usurio por lugar 
  searchByPlace(place: Place): Observable<User[]> {
    const url = `${ apiUrl }/places/${place}`;

    if (this.queryCachePlace.has(place)) {
      return of(this.queryCachePlace.get(place) ?? [])
    }

    return this.http.get<User[]>(url).pipe(
      map((res: User[]) => res),
      tap((users) => this.queryCachePlace.set(place,users)),
      delay(2500),
      catchError((error) => {
        console.log(error);
        return throwError(
          () => Error (`No se encontro ningun usuario en: ${place}`)
        );
      })
    )
  }

  //? obtener departamentos
  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/departments');
  }

  //? obtener lugares
  getPlaces(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/places');
  }

  //? crear contacto completo
  createFullContact(contact: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/create-full`, contact);
  }
}

function UserInterface(resp: User[]): any {
  throw new Error('Function not implemented.');
}

