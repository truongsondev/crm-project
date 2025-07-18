export interface User {
  id: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  address: string;
  salutation: string;
  role: string;
  job_title: string;
  active: boolean;
  manager: boolean;
  manager_name: {
    id: string;
    name: string;
  };
  hired_date: Date;
  terminated_date: Date;
  created_time: Date;
  updated_time: Date;
}
