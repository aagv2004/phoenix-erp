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

export interface RegisterTestUserPayload {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  company_id?: string;
  branch_id?: string;
}

export const getCurrentUser = () => {
  return client.get<User>("/auth/me");
};

export const loginRequest = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};

export const registerTestUser = async (payload: RegisterTestUserPayload) => {
  const response = await client.post<User>("/auth/register-test", payload);
  return response.data;
};
