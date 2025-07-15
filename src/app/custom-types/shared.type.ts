import { User } from '@app/interfaces/user.interface';

export type HeaderColumn = {
  column: string;
  label: string;
};

export type formUser = {
  user: User;
  action: string;
};
