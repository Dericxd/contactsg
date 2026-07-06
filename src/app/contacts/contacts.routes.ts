import { Routes } from '@angular/router';
import { GeniacareLayout } from '../layouts/geniacare-layout/geniacare-layout';

export const contactsRoutes: Routes = [
  {
    path: '',
    component: GeniacareLayout,
    children: [
      //? User
      {
        path: 'by-user',
        // component: ByUserComponent
      },

      //? Departamento

      //? Lugar
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
]

export default contactsRoutes;
