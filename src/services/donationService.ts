import { apiFetch } from "../api/api";

import type {
  DonationCreateRequest,
  DonationPage,
  DonationResponse,
} from "../types/donationTypes";

export async function createDonation(
  data: DonationCreateRequest,
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
    "/donations/community?type=HELP_REQUEST&status=PENDING&page=0&size=50",
  );
}

// Assumir um pedido ou oferta
export async function fulfillDonation(id: number): Promise<DonationResponse> {
  return apiFetch<DonationResponse>(`/donations/${id}/fulfill`, {
    method: "PATCH",
  });
}

export async function completeDonation(id: number): Promise<DonationResponse> {
  return apiFetch<DonationResponse>(`/donations/${id}/complete`, {
    method: "PATCH",
  });
}

export interface DonationReviewRequest {
  reviewNotes: string;
}

export async function reviewDonation(
  id: number,
  data: DonationReviewRequest
): Promise<DonationResponse> {
  return apiFetch<DonationResponse>(`/donations/${id}/review`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
