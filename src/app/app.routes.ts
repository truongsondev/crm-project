import { Routes } from '@angular/router';
import { UserManagementComponent } from '@pages/user/user.component';
import { LayoutComponent } from './layout/layout.component';
import { ContactComponet } from './pages/contacts/contact.component';
import { DashboardComponet } from './pages/dashboard/dashboard.component';
import { OrderComponet } from './pages/salesOrders/order.componet';

export const routes: Routes = [
  {
    path: 'user-management',
    component: UserManagementComponent,
  },
  {
    path: 'contacts',
    component: ContactComponet,
  },
  {
    path: 'sales-orders',
    component: OrderComponet,
  },
  {
    path: 'dashboard',
    component: DashboardComponet,
  },
];
