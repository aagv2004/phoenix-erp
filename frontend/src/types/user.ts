export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  company_id?: string; // <--- Agrega esto
}
