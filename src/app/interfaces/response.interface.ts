import { User } from './user.interface';

export interface DataLoginResponse {
  code: number;
  metadata: {
    user: User;
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface UserResponse {
  code: number;
  users: User[];
}
