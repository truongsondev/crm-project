import { environment } from '@app/environments/environment.dev';

export const getEndpoints = () => {
  return {
    user: {
      v1: {
        users: `${environment.baseURL}/users`,
        create_user: `${environment.baseURL}/users`,
        update_user: `${environment.baseURL}/users/:id`,
        download_user: `${environment.baseURL}/users/download`,
        create_users: `${environment.baseURL}/multiple-user`,
      },
    },
    contact: {
      v1: {
        contacts: `${environment.baseURL}/contacts`,
        create_contact: `${environment.baseURL}/contacts`,
        update_contact: `${environment.baseURL}/contacts/:id`,
        delete_contact: `${environment.baseURL}/contacts/delete/:id`,
        download_contact: `${environment.baseURL}/contacts/download`,
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
