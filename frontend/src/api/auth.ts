import client from "./client";
import type { User } from "../types/user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export const loginRequest = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};
