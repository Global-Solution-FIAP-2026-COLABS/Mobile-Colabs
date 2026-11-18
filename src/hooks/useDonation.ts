import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDonation,
  fulfillDonation,
  getCommunityDonations,
  getMyDonations,
  completeDonation,
  reviewDonation,
  type DonationReviewRequest,
} from "../services/donationService";

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

export function useCompleteDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myDonations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["communityDonations"],
      });
    },
  });
}

export function useReviewDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: DonationReviewRequest;
    }) => reviewDonation(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myDonations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["communityDonations"],
      });
    },
  });
}