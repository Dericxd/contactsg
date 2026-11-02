import { Routes } from '@angular/router';
import { GeniacareLayout } from '../layouts/geniacare-layout/geniacare-layout';
import { StaffPage } from './pages/staff-page/staff-page';
import { CreatePage } from './pages/create-page/create-page';
import { PlacePage } from './pages/place-page/place-page';
import { CompanyLinePage } from './pages/companyLine-page/companyLine-page';
import { CreateCompanyLine } from './pages/companyLine-page/create-company-line/create-company-line';
import { DepartmentsPage } from './pages/departments-page/departments-page';
import { authGuard } from '../auth/auth.guard';
import { permissionGuard, adminGuard } from '../auth/permission.guard';

export const contactsRoutes: Routes = [
  {
    path: '',
    component: GeniacareLayout,
    children: [
      // ====== Rutas protegidas por permisos ======
      {
        path: 'admin',
        canActivate: [authGuard],
        children: [
          {
            path: 'by-staff',
            component: StaffPage,
            canActivate: [permissionGuard],
            data: { permissions: ['agenda.view'] }
          },
          {
            path: 'by-place',
            component: PlacePage,
            canActivate: [permissionGuard],
            data: { permissions: ['agenda.by-place', 'agenda.view'] }
          },
          {
            path: 'by-departments',
            component: DepartmentsPage,
            canActivate: [permissionGuard],
            data: { permissions: ['departments.view'] }
          },
          {
            path: 'by-company-line',
            component: CompanyLinePage,
            canActivate: [permissionGuard],
            data: { permissions: ['phone-lines.view'] }
          },
          {
            path: 'by-create',
            component: CreatePage,
            canActivate: [permissionGuard],
            data: { permissions: ['employees.create'] }
          },
          {
            path: 'by-create-line',
            component: CreateCompanyLine,
            canActivate: [permissionGuard],
            data: { permissions: ['phone-lines.create'] }
          },
          {
            path: 'permissions',
            canActivate: [adminGuard],
            loadComponent: () => import('./pages/permissions-page/permissions-page').then(m => m.PermissionsPage)
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

      // ====== Redirect por defecto ======
      {
        path: '**',
        redirectTo: 'admin/by-staff'
      }
    ]
  }
];

export default contactsRoutes;
