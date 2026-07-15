import { Routes } from '@angular/router';
import { GeniacareLayout } from '../layouts/geniacare-layout/geniacare-layout';
import { StaffPage } from './pages/staff-page/staff-page';
import { CreatePage } from './pages/create-page/create-page';
import { PlacePage } from './pages/place-page/place-page';

export const contactsRoutes: Routes = [
  {
    path: '',
    component: GeniacareLayout,
    children: [
      //? User
      {
        path: 'by-staff',
        component: StaffPage
      },

      //? Crear
      {
        path: 'by-create',
        component: CreatePage
      },

      //? Lugar
      {
        path: 'by-place',
        component: PlacePage
      },
      
      //? redirect
      {
        path: '**',
        redirectTo: 'by-staff'
      }
    ]
  }
]

export default contactsRoutes;
