import client from "./client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string[];
  };
  access_token: string;
}

export const loginRequest = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};
