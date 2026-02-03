import type { Company } from "./company";

export interface Branch {
  id: string;
  name: string;
  address: string;
  // La sucursal viene con el objeto company completo anidado
  company?: Company;
}
