export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  address: string;
  salutation: string;
  role: string;
  job_title: string;
  is_active: boolean;
  is_manager: boolean;
  manager_name: any;
  hired_date: Date;
  terminated_date: Date;
  created_time: Date;
  updated_time: Date;
}
