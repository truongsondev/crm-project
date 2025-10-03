import { Contact } from '@app/interfaces/contact.interface';
import { SalesOrder } from '@app/interfaces/sales-order.interface';
import { User } from '@app/interfaces/user.interface';

export type HeaderColumn = {
  column: string;
  label: string;
};

export type UserTableState = {
  action: string;
  selectedRow: User | null;
  dataList: User[];
};

export type SelectOption = {
  value: string;
  label: string;
};
export type ContactTableState = {
  action: string;
  selectedRow: Contact | null;
  dataList: Contact[];
};

export type ErrorMessage = {
  message: string;
};

export type ModalOrigin = {
  from: string;
};

export type SalesOrderTableState = {
  action: string;
  selectedRow: SalesOrder | null;
  dataList: SalesOrder[];
};
