import type { Company } from "./company";
import type { Branch } from "./branch";

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  company_id?: string;
  branch_id?: string;

  company?: Company;
  branch?: Branch;
}
