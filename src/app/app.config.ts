import { ApplicationConfig, Injectable, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { Observable } from 'rxjs';

Injectable({
  providedIn: 'root'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // provideHttpClient(withFetch()),
    provideHttpClient(),
  ]
};

//? conexion con la base de datos 
export class DataService {

  private apiUrl = 'http://localhost:3000/api/datos';

  constructor(private http: HttpClient) {}

  getData():Observable<any> {
    return this.http.get<any>(this.apiUrl)
  }
}
