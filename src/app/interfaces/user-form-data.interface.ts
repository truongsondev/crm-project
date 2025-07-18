import { User } from './user.interface';

export interface UserFormData {
  action: 'create' | 'update';
  selectedUser: User | null;
  userList: User[];
}
