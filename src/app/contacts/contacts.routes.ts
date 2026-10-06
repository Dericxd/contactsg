import { Routes } from '@angular/router';
import { GeniacareLayout } from '../layouts/geniacare-layout/geniacare-layout';
import { StaffPage } from './pages/staff-page/staff-page';
import { CreatePage } from './pages/create-page/create-page';
import { PlacePage } from './pages/place-page/place-page';
import { CompanyLinePage } from './pages/companyLine-page/companyLine-page';
import { CreateCompanyLine } from './pages/companyLine-page/create-company-line/create-company-line';

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

      //? Crear usuario
      {
        path: 'by-create',
        component: CreatePage
      },

      //? Lugar
      {
        path: 'by-place',
        component: PlacePage
      },

      //? Linea de compañia
      {
        path: 'by-company-line',
        component: CompanyLinePage,
      },

      //? Crear linea de compañia
      {
        path: 'by-create-line',
        component: CreateCompanyLine
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
