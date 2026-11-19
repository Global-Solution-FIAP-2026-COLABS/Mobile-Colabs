import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://colabs-java.onrender.com";

const TOKEN_KEY = "@colabs:token";

const CITIZEN_ID_KEY = "@colabs:citizenId";

const ROLE_KEY = "@colabs:role";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function saveCitizenId(id: number) {
  await AsyncStorage.setItem(CITIZEN_ID_KEY, String(id));
}

export async function getCitizenId(): Promise<number | null> {
  const id = await AsyncStorage.getItem(CITIZEN_ID_KEY);
  return id ? Number(id) : null;
}

export async function removeCitizenId() {
  await AsyncStorage.removeItem(CITIZEN_ID_KEY);
}

export async function clearSession() {
  await Promise.all([
    removeToken(),
    removeCitizenId(),
    removeRole(),
  ]);
}

export async function saveRole(role: string) {
  await AsyncStorage.setItem(ROLE_KEY, role);
}

export async function getRole(): Promise<string | null> {
  return AsyncStorage.getItem(ROLE_KEY);
}

export async function removeRole() {
  await AsyncStorage.removeItem(ROLE_KEY);
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const responseBody = await response.text();

    let message = `Erro na API: ${response.status}`;

    if (responseBody) {
      try {
        const errorData = JSON.parse(responseBody);

        message =
          errorData.message ??
          errorData.detail ??
          errorData.error ??
          responseBody;
      } catch {
        message = responseBody;
      }
    }
    console.log("STATUS:", response.status);
    console.log("RESPOSTA DO BACKEND:", responseBody);

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
