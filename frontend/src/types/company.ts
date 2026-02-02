export interface Company {
  id: string;
  name: string;
  tax_id: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
