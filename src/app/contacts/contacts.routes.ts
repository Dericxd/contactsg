import { Routes } from '@angular/router';
import { GeniacareLayout } from '../layouts/geniacare-layout/geniacare-layout';
import { StaffPage } from './pages/staff-page/staff-page';
import { CreatePage } from './pages/create-page/create-page';
import { PlacePage } from './pages/place-page/place-page';
import { CompanyLinePage } from './pages/companyLine-page/companyLine-page';
import { CreateCompanyLine } from './pages/companyLine-page/create-company-line/create-company-line';
import { DepartmentsPage } from './pages/departments-page/departments-page';
import { authGuard } from '../auth/auth.guard';
import { roleGuard } from '../auth/role.guard';
import { AuthService } from '../auth/auth.service';

export const contactsRoutes: Routes = [
  {
    path: '',
    component: GeniacareLayout,
    children: [
      // ====== Rutas protegidas (login + rol) ======
      {
        path: 'admin',
        canActivate: [authGuard],
        children: [
          {
            path: 'by-staff',
            component: StaffPage,
            canActivate: [roleGuard],
            data: { roles: AuthService.DIRECTORY_ROLES }
          },
          {
            path: 'by-place',
            component: PlacePage,
            canActivate: [roleGuard],
            data: { roles: AuthService.DIRECTORY_ROLES }
          },
          {
            path: 'by-departments',
            component: DepartmentsPage,
            canActivate: [roleGuard],
            data: { roles: AuthService.DEPARTMENT_ROLES }
          },
          {
            path: 'by-company-line',
            component: CompanyLinePage,
            canActivate: [roleGuard],
            data: { roles: AuthService.COMPANY_LINE_ROLES }
          },
          {
            path: 'by-create',
            component: CreatePage,
            canActivate: [roleGuard],
            data: { roles: AuthService.MANAGE_ROLES }
          },
          {
            path: 'by-create-line',
            component: CreateCompanyLine,
            canActivate: [roleGuard],
            data: { roles: AuthService.MANAGE_ROLES }
          },
          {
            path: '',
            redirectTo: 'by-staff',
            pathMatch: 'full'
          }
        ]
      },

      // ====== Redirecciones de compatibilidad (URLs viejas) ======
      {
        path: 'by-staff',
        redirectTo: 'admin/by-staff'
      },
      {
        path: 'by-place',
        redirectTo: 'admin/by-place'
      },
      {
        path: 'by-departments',
        redirectTo: 'admin/by-departments'
      },
      {
        path: 'by-company-line',
        redirectTo: 'admin/by-company-line'
      },

      // ====== Redirect ======
      {
        path: '**',
        redirectTo: 'admin/by-staff'
      }
    ]
  }
];

export default contactsRoutes;
