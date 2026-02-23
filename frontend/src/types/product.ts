export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost?: number;
  min_stock: number;
  company_id: string;
  createdAt: string;
  updatedAt: string;
}
