export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  min_stock: number;
  company_id: string;
  created_at: string;
}
