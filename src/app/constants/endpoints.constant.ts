import { environment } from '@app/environments/environment.dev';

export const getEndpoints = () => {
  return {
    user: {
      v1: {
        users: `${environment.baseURL}/employees`,
        create_user: `${environment.baseURL}/employees`,
        update_user: `${environment.baseURL}/employees/:id`,
      },
    },
    contact: {
      v1: {
        contacts: `${environment.baseURL}/contacts`,
        create_contact: `${environment.baseURL}/contacts`,
        update_contact: `${environment.baseURL}/contacts/:id`,
      },
    },
  } as const;
};
