
import { apiFetch } from "./api";

import type {
  DonationCreateRequest,
  DonationResponse,
  DonationPage,
} from "../types/donationTypes";

export async function createDonation(
  data: DonationCreateRequest
): Promise<DonationResponse> {
  return apiFetch<DonationResponse>("/donations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMyDonations(): Promise<DonationPage> {
  return apiFetch<DonationPage>("/donations?page=0&size=50");
}

// Buscar pedidos e ofertas do mural comunitário
export async function getCommunityDonations(): Promise<DonationPage> {
  return apiFetch<DonationPage>(
    "/donations/community?type=HELP_REQUEST&status=PENDING&page=0&size=50"
  );
}

// Assumir um pedido ou oferta
export async function fulfillDonation(
  id: number
): Promise<DonationResponse> {
  return apiFetch<DonationResponse>(`/donations/${id}/fulfill`, {
    method: "PATCH",
  });
}


