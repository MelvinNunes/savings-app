import { SavingsChallenge } from "@/types/savings";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { supabaseClient } from "./client/supabase";

export function useCreateChallenge(userId: string) {
  const queryClient = useQueryClient();

  const { isLoading, isError, mutate, isSuccess } = useMutation({
    mutationFn: async (data: SavingsChallenge) => {
      const res = await supabaseClient
        .from("savings_challenges")
        .insert([{ ...data, user_id: userId }]);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["savings-challenges", userId],
      });
    },
  });

  return {
    isLoading,
    isSuccess,
    isError,
    createChallenge: mutate,
  };
}

export function useGetAllUserChallenges(userId: string, enabled: boolean) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["savings-challenges", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabaseClient
        .from("savings_challenges")
        .select("*")
        .eq("user_id", userId)
        .order("createdAt", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
    initialData: [],
    retry: 1,
    refetchOnWindowFocus: true,
    enabled: enabled,
  });
  return { data, isLoading, isFetching };
}
