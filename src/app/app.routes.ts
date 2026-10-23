import { Routes } from '@angular/router';
import { HomePage } from './shared/pages/home/home-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login-page/login-page').then(m => m.LoginPage)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.routes'),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
