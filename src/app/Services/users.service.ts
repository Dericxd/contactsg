import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly apiUrl = 'http://localhost:3000/contacts/staff';
  private readonly http = inject(HttpClient);

  //? los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  //? crear
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  //? actualizar
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  //! borrar
  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }
}
