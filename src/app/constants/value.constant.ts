import { HeaderColumn } from '@app/custom-types/shared.type';

export const ITEM_OF_PAGE = 10;

export const COLUMNDEFS: HeaderColumn[] = [
  { column: 'all', label: 'All' },
  { column: 'employee', label: 'Employee' },
  { column: 'username', label: 'Username' },
  { column: 'email', label: 'Email' },
  { column: 'salutation', label: 'Salutation' },
  { column: 'role', label: 'Role' },
  { column: 'job_title', label: 'Job Title' },
  { column: 'manager_name', label: 'Manager' },
  { column: 'action', label: 'Action' },
];

export const DISPLAYROLES = {
  USER_ADMIN: 'Admin',
  DIR: 'Director',
  SALES_MGR: 'Sales Manager',
  SALES_EMP: 'Sales Person',
  CONTACT_MGR: 'Contact Manager',
  CONTACT_EMP: 'Contact Employee',
  USER_READ_ONLY: 'Guest',
};

export const DISPLAYCOLUMNROLE = [
  'all',
  'employee',
  'username',
  'email',
  'salutation',
  'role',
  'job_title',
  'manager_name',
  'action',
];
