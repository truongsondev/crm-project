export interface SalesOrder {
  _id: string;
  order_number: string;
  subject: string;
  contact_id: string;
  status: string;
  total: number;
  assigned_to: string;
  creator_id: string;
  description: string;
  purchase_on: Date;
  updated_on: Date;
}
