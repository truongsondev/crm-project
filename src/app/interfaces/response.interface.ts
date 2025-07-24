import { Contact } from './contact.interface';
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

export interface UsersResponse {
  code: number;
  users: User[];
}

export interface UserResponse {
  code: number;
  users: User;
}

export interface ContactsReponse {
  code: number;
  contacts: Contact[];
}
export interface ContactReponse {
  code: number;
  contact: Contact;
}
