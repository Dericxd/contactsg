import { Routes } from '@angular/router';
import { HomePage } from './shared/pages/home/home-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.routes'),
  },
  {
    path: '**',
    redirectTo: 'staff'
  }
];
