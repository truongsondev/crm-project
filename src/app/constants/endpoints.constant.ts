import { environment } from '@app/environments/environment.dev';

export const getEndpoints = () => {
  return {
    user: {
      v1: {
        users: `${environment.baseURL}/employees`,
        create_user: `${environment.baseURL}/employees/create`,
      },
    },
  } as const;
};
