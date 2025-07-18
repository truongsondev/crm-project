import { User } from '@app/interfaces/user.interface';

export type HeaderColumn = {
  column: string;
  label: string;
};

export type FormUser = {
  action: string;
  selectedUser: User | null;
  userList: User[];
};

export type ListFormUser = {
  action: string;
  userList: User[];
};

export type SelectOption = {
  value: string;
  label: string;
};
