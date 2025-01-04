import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient({
  isSingleton: true,
});

export async function getUser() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    return null;
  }
}

export async function loginWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return error;
}

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });
  return error;
}
