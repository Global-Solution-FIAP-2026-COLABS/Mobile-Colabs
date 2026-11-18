export type DonationCategory =
  | "FOOD"
  | "CLOTHING"
  | "HYGIENE"
  | "MEDICINE"
  | "FURNITURE"
  | "OTHER";

export type RecordType = "DONATION_OFFER" | "HELP_REQUEST";

export interface DonationItemRequest {
  name: string;
  quantity: number;
  category: DonationCategory;
}

export interface DonationCreateRequest {
  type: RecordType;
  title: string;
  description: string;
  citizenId: number;
  collectionPointId?: number | null;
  items: DonationItemRequest[];
}

export type DonationStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "APPROVED"
  | "REJECTED"
  | "DELIVERED"
  | "CANCELLED";

export interface DonationPage {
  content: DonationResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface DonationItemResponse {
  id: number;
  name: string;
  quantity: number;
  category: DonationCategory;
  categoryLabel: string;
}

export interface DonationResponse {
  id: number;
  type: RecordType;
  title: string;
  description: string;
  totalQuantity: number;
  status: DonationStatus;
  urgency: string;
  aiSuggestedCategory: string | null;
  aiTriageReason: string | null;
  createdAt: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
  citizenId: number;
  citizenName: string;
  citizenAddress: string;
  collectionPointId: number | null;
  collectionPointName: string | null;
  collectionPointAddress: string | null;
  fulfilledByCitizenId: number | null;
  fulfilledByCitizenName: string | null;
  items: DonationItemResponse[];
  
}