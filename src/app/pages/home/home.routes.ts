import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home.component').then((m) => m.HomeComponent),
    children: [
      {
        path: 'user-management',
        loadComponent: () =>
          import('../user/user.component').then(
            (m) => m.UserManagementComponent,
          ),
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('../contact/contact.component').then(
            (m) => m.ContactComponent,
          ),
      },
      {
        path: 'sales-orders',
        loadComponent: () =>
          import('../salesOrder/sales-order.componet').then(
            (m) => m.SaleOrderComponet,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../dashboard/dashboard.component').then(
            (m) => m.DashboardComponet,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
