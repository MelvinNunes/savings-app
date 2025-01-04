import { useMutation, useQuery } from "@tanstack/react-query";
import { supabaseClient } from "./client/supabase";

export function useCreateChallenge() {
  const { isPending, isError, mutate, isSuccess } = useMutation({
    mutationFn: async (data: any) => {
      const res = await supabaseClient
        .from("savings_challenges")
        .insert([{ ...data, user_id: data.user_id }])
        .select("*");
      return res;
    },
    onSuccess: (result: any) => {
      // Get current data from cache
    },
  });

  return {
    isPending,
    isSuccess,
    isError,
    createChallenge: mutate,
  };
}

export async function useGetAllUserChallenges(userId: string) {
  const { data, error } = await supabaseClient
    .from("savings_challenges")
    .select("*")
    .eq("user_id", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    throw error;
  }
  return data || [];
}
