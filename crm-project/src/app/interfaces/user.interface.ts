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
  manager_name: {
    _id: string;
    name: string;
  };
  hired_date: Date;
  password: string;
  terminated_date: Date;
  created_on: Date;
  updated_on: Date;
}
