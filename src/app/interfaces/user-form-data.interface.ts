import { User } from './user.interface';

export interface UserFormData {
  action: 'create' | 'update';
  dataSelected: any | null;
  dataList: any[];
}
