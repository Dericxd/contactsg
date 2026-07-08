import { Routes } from '@angular/router';
import { GeniacareLayout } from '../layouts/geniacare-layout/geniacare-layout';
import { StaffPage } from './pages/staff-page/staff-page';

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

      //? Departamento

      //? Lugar
      {
        path: '**',
        redirectTo: 'by-staff'
      }
    ]
  }
]

export default contactsRoutes;
