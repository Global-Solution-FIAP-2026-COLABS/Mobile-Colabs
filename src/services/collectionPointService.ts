import { apiFetch } from "../api/api";
import type { CollectionPointPage } from "../types/collectionPointTypes";

export async function getCollectionPoints() {
  return apiFetch<CollectionPointPage>("/collection-points?page=0&size=40");
}