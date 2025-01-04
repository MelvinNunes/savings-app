import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { getAuthToken, removeAuthToken, setAuthToken } from "./token.utils";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const supabase = createClientComponentClient({
  isSingleton: true,
});

export async function getUser() {
  try {
    const jwt = getAuthToken();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(jwt);

    if (error) {
      removeAuthToken();
      return null;
    }

    return user;
  } catch (error) {
    removeAuthToken();
    return null;
  }
}

export async function useLoginWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const {
    error,
    data: { session },
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (session) setAuthToken(session.access_token);
  return error;
}

export async function useLoginWithGoogle() {
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);
  // if (session) setAuthToken(session.access_token);
  return error;
}

export function useAuthentication() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return { user, isLoading };
}
