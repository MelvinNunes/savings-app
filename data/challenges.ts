import { useMutation, useQuery } from "@tanstack/react-query";
import { supabaseClient } from "./client/supabase";
import { getUser } from "@/lib/auth";

export function useCreateChallenge() {
  const { isPending, isError, mutate, isSuccess } = useMutation({
    mutationFn: async (data: any) => {
      const res = await supabaseClient
        .from("savings_challenges")
        .insert([{ ...data, user_id: data.user_id }])
        .select("*");
      return res;
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

export async function useGetChallengeById(id: string) {
  const user = await getUser();

  if (!user) throw new Error("Please login to see the challenge");

  const { data: challenge } = await supabaseClient
    .from("savings_challenges")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  return challenge;
}

export async function useEditChallenge(id: string, updatedChallenge: any) {
  const user = await getUser();

  if (!user) throw new Error("Please login to archive the challenge");

  const { error } = await supabaseClient
    .from("savings_challenges")
    .update(updatedChallenge)
    .eq("id", id)
    .eq("user_id", user.id);
  return error;
}

export async function useArchiveChallenge(id: string, isArchived: boolean) {
  const user = await getUser();

  if (!user) throw new Error("Please login to archive the challenge");

  const { error } = await supabaseClient
    .from("savings_challenges")
    .update({
      isArchived: isArchived,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  return error;
}

export async function useUpdateChallengeProgress(id: string, newProgress: any) {
  const user = await getUser();

  if (!user) throw new Error("Please login to update the challenge progress");

  const { error } = await supabaseClient
    .from("savings_challenges")
    .update({
      progress: newProgress,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);
  return error;
}

export async function useDeleteChallenge(id: string) {
  const user = await getUser();

  if (!user) throw new Error("Please login to delete the challenge");

  const { error } = await supabaseClient
    .from("savings_challenges")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  return error;
}
