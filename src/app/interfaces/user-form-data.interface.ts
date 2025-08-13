import { User } from './user.interface';

export interface FormData {
  action: 'create' | 'update';
  dataSelected: any | null;
  dataList: any[];
  message: string;
  from: string;
}
