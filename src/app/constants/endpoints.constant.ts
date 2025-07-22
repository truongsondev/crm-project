import { environment } from '@app/environments/environment.dev';

export const getEndpoints = () => {
  return {
    user: {
      v1: {
        users: `${environment.baseURL}/users`,
        create_user: `${environment.baseURL}/users`,
        update_user: `${environment.baseURL}/users/:id`,
      },
    },
    contact: {
      v1: {
        contacts: `${environment.baseURL}/contacts`,
        create_contact: `${environment.baseURL}/contacts`,
        update_contact: `${environment.baseURL}/contacts/:id`,
      },
    },
    auth: {
      v1: {
        signIn: `${environment.baseURL}/auth/sign-in`,
        create_contact: `${environment.baseURL}/contacts`,
        update_contact: `${environment.baseURL}/contacts/:id`,
      },
    },
  } as const;
};
