
import { apiFetch, saveToken } from "../api/api";

import type {
  RegisterRequest,
  AccountResponse,
  LoginRequest,
  LoginResponse,
} from "../types/authTypes";

export async function register(
  data: RegisterRequest
): Promise<AccountResponse> {
  return apiFetch<AccountResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  await saveToken(response.token);

  return response;
}
