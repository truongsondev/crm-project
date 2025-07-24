import { Contact } from '@app/interfaces/contact.interface';
import { User } from '@app/interfaces/user.interface';

export type HeaderColumn = {
  column: string;
  label: string;
};

export type FormUser = {
  action: string;
  dataSelected: User | null;
  dataList: User[];
};

export type ListFormUser = {
  action: string;
  userList: User[];
};

export type SelectOption = {
  value: string;
  label: string;
};

export type FormContact = {
  action: string;
  dataSelected: Contact | null;
  dataList: Contact[];
};
