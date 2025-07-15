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
  } as const;
};
