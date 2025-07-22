import { Routes } from '@angular/router';
import { UserManagementComponent } from '@pages/user/user.component';
import { LayoutComponent } from './layout/layout.component';
import { LayoutAuthComponent } from './pages/auth/layoutAuth/layout-auth.component';
import { SignInComponent } from './pages/auth/signIn/sign-in.component';
import { SignUpComponent } from './pages/auth/signUp/sign-up.component';
import { ContactComponent } from './pages/contacts/contact.component';
import { DashboardComponet } from './pages/dashboard/dashboard.component';
import { OrderComponet } from './pages/salesOrders/order.componet';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'user-management',
        component: UserManagementComponent,
      },
      {
        path: 'contacts',
        component: ContactComponent,
      },
      {
        path: 'sales-orders',
        component: OrderComponet,
      },
      {
        path: 'dashboard',
        component: DashboardComponet,
      },
      {
        path: 'login',
        component: LayoutAuthComponent,
      },
    ],
  },
  {
    path: 'auth',
    component: LayoutAuthComponent,
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
    ],
  },
];
