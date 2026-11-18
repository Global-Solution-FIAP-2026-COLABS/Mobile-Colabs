import {
  apiFetch,
  saveToken,
  saveCitizenId,
  removeCitizenId,
  getToken,
} from "../api/api";

import type {
  RegisterRequest,
  AccountResponse,
  LoginRequest,
  LoginResponse,
} from "../types/authTypes";

export async function register(
  data: RegisterRequest,
): Promise<AccountResponse> {
  return apiFetch<AccountResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  await saveToken(response.token);

  const savedToken = await getToken();

  console.log("TOKEN SALVO:", savedToken ? "SIM" : "NÃO");
  console.log("TOKEN CONFERE:", savedToken === response.token);

  if (response.citizenId !== null) {
    await saveCitizenId(response.citizenId);
  } else {
    await removeCitizenId();
  }

  console.log("========== LOGIN ==========");
  console.log("EMAIL:", response.email);
  console.log("ROLE:", response.role);
  console.log("CITIZEN ID:", response.citizenId);
  console.log("COLLECTION POINT ID:", response.collectionPointId);
  console.log("TOKEN RECEBIDO:", response.token ? "SIM" : "NÃO");

  return response;
}
