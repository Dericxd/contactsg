export interface CompanyLineInterface {
  id?: number;
  serial: string;
  phone_number: string;
  status: string;
  active_status: string;
  operator: string;
  user_id?: number | null;
  user_name?: string | null;
  user_last_name?: string | null;
  assigned_user?: string | null;
  assigned_date?: string | null;
  created_at?: string;
  updated_at?: string;
}
