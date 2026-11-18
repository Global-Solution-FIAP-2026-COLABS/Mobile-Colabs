
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createDonation,
  getMyDonations,
  getCommunityDonations,
  fulfillDonation,
} from "../api/donationApi";

export function useCreateDonation() {
  return useMutation({
    mutationFn: createDonation,
  });
}

export function useMyDonations() {
  return useQuery({
    queryKey: ["myDonations"],
    queryFn: getMyDonations,
  });
}

export function useCommunityDonations() {
  return useQuery({
    queryKey: ["communityDonations"],
    queryFn: getCommunityDonations,
    staleTime: 0,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
}

export function useFulfillDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fulfillDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityDonations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myDonations"],
      });
    },
  });
}
