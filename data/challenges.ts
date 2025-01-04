import { getUser } from "@/lib/auth";
import { SavingsChallenge } from "@/types/savings";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function useGetAllUserChallenges(): Promise<SavingsChallenge[]> {
  const supabase = createClientComponentClient();

  return getUser()
    .then((user) => {
      if (!user) throw new Error("Not authenticated");

      return supabase
        .from("savings_challenges")
        .select("*")
        .eq("user_id", user.id)
        .order("createdAt", { ascending: false });
    })
    .then(({ data, error }) => {
      if (error) throw error;
      return data || [];
    })
    .catch(() => {
      return [];
    });
}
