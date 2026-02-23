import client from "./client";
import type { Product } from "../types/product";

export const getProducts = () => client.get<Product[]>("/products");
export const createProduct = (data: {
  name: string;
  description?: string;
  sku: string;
  price: number;
  min_stock?: number;
  company_id: string;
}) => client.post("/products", data);
export const updateProduct = (id: string) => client.delete(`/products/${id}`);
