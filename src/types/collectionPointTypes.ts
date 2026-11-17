export interface CollectionPointResponse {
  id: number;
  name: string;
  cnpj: string;
  address: string;
  neighborhood: string;
  phone: string;
  active: boolean;
}

export interface CollectionPointPage {
  content: CollectionPointResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}