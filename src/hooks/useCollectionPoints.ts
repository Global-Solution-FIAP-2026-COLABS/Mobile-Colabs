import { useQuery } from "@tanstack/react-query";
import { getCollectionPoints } from "../services/collectionPointService";

export function useCollectionPoints() {
  return useQuery({
    queryKey: ["collectionPoints"],
    queryFn: getCollectionPoints,
  });
}