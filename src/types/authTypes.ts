
export type UserRole =
  | "ROLE_CITIZEN"
  | "ROLE_POINT_MANAGER"
  | "ROLE_ADMIN";

export type AccountType = "CITIZEN" | "COLLECTION_POINT";

// Dados do cidadão
export interface CitizenRequest {
  name: string;
  cpf: string;
  phone: string;
  address: string;
}

// Dados do ponto de coleta
export interface CollectionPointRequest {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  active: boolean | null;
}

// Cadastro de conta + perfil
export interface RegisterRequest {
  accountType: AccountType;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  cpf?: string | null;
  cnpj?: string | null;
  neighborhood?: string | null;
  active?: boolean;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

// Resposta do cadastro
export interface AccountResponse {
  id: number;
  email: string;
  role: UserRole;
  citizenId: number | null;
  collectionPointId: number | null;
}

// Resposta do login
export interface LoginResponse {
  token: string;
  type: string;
  email: string;
  role: UserRole;
  citizenId: number | null;
  collectionPointId: number | null;
}
