export interface FormData {
  action: 'create' | 'update';
  selectedRow: any | null;
  dataList: any[];
  message: string;
  from: string;
}
