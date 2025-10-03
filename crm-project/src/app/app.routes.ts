import { Routes } from '@angular/router';

import { homeRoutes } from './pages/home/home.routes';

export const routes: Routes = [
  ...homeRoutes,
  {
    path: 'auth/sign-in',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
];
