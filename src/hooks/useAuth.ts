
import { useMutation } from "@tanstack/react-query";

import { login, register } from "../services/authService";

import type {
  LoginRequest,
  RegisterRequest,
} from "../types/authTypes";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  });
}
