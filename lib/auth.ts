import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { getAuthToken, setAuthToken } from "./token.utils";

const supabase = createClientComponentClient({
  isSingleton: true,
});

export async function getUser() {
  try {
    const jwt = getAuthToken();
    const {
      data: { user },
    } = await supabase.auth.getUser(jwt);

    console.log(user);
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

export async function loginWithGoogle() {
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
