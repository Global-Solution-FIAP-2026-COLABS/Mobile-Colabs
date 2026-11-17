import { useMutation } from "@tanstack/react-query";

import { login, register } from "../services/authService";
import { saveCitizenId } from "../api/api";

import type {
  LoginRequest,
  RegisterRequest,
} from "../types/authTypes";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),

    onSuccess: async (response) => {
      if (response.citizenId !== null) {
        await saveCitizenId(response.citizenId);
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  });
}