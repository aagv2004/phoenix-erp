import client from "./client";
import type { Product } from "../types/product";

export const getProducts = () => client.get<Product[]>("/products");
export const createProduct = (data: Partial<Product>) =>
  client.post("/products", data);
export const updateProduct = (id: string) => client.delete(`/products/${id}`);
