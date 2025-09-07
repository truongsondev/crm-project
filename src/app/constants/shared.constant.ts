export const ITEM_OF_PAGE = 10;

export const DISPLAY_ROLES = {
  USER_ADMIN: 'Admin',
  DIR: 'Director',
  SALES_MGR: 'Sales Manager',
  SALES_EMP: 'Sales Person',
  CONTACT_MGR: 'Contact Manager',
  CONTACT_EMP: 'Contact Employee',
  USER_READ_ONLY: 'Guest',
};

export const LEAD_SOURCE = [
  'Existing Customer',
  'Partner',
  'Conference',
  'Website',
  'Word of mouth',
  'Other',
];

export const SALUTATIONS = [
  { value: 'None', label: 'None' },
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Dr.', label: 'Dr.' },
  { value: 'Prof.', label: 'Prof.' },
  { value: 'Ms.', label: 'Ms.' },
];

export const ROLES = [
  { value: 'USER_ADMIN', label: 'Admin' },
  { value: 'DIR', label: 'Director' },
  { value: 'SALES_MGR', label: 'Sales Manager' },
  { value: 'SALES_EMP', label: 'Sales Person' },
  { value: 'CONTACT_MGR', label: 'Contact Manager' },
  { value: 'CONTACT_EMP', label: 'Contact Employee' },
  { value: 'USER_READ_ONLY', label: 'Guest' },
];

export const ACTION = {
  SELECT: 'select',
  UPDATE: 'update',
  CREATE: 'create',
  NONE: '#',
};

export const STATUS_OPTION = ['Created', 'Approved', 'Delivered', 'Canceled'];

export const ERROR_MESSAGES: Record<
  number,
  { title: string; message: string }
> = {
  401: {
    title: 'Unauthorized',
    message: 'You are not authorized to access this resource.',
  },
  403: {
    title: 'Forbidden',
    message: 'You do not have permission to perform this action.',
  },
  404: {
    title: 'Invalid URL',
    message: 'The requested resource could not be found.',
  },
  409: {
    title: 'Conflict',
    message: 'A conflict occurred with the current state of the resource.',
  },
  500: {
    title: 'Server Error',
    message: 'An unexpected error occurred on the server.',
  },
};
