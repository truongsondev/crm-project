export interface Contact {
  _id: string;
  contact_name: string;
  salutation: string;
  assigned_to: {
    _id: string;
    name: string;
  };
  address: string;
  phone: string;
  email: string;
  organization: string;
  birthday: Date;
  lead_source: string;
  description: string;
  created_on: Date;
  updated_on: Date;
  isChecked: Boolean;
}
