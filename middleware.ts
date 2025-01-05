import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "pt"];
const defaultLocale = "pt";

function getLocale(request: NextRequest): string {
  // Get the Accept-Language header directly
  const acceptLanguage = request.headers.get("accept-language");

  try {
    // Only create negotiator if we have a valid accept-language header
    if (acceptLanguage) {
      const negotiatorHeaders = { "accept-language": acceptLanguage };
      const negotiator = new Negotiator({ headers: negotiatorHeaders });
      const languages = negotiator.languages();

      return matchLocale(languages, locales, defaultLocale);
    }
  } catch (e) {
    console.error("Locale matching error:", e);
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Create a Supabase client configured to use cookies
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({
    req: request,
    res: response,
  });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  // Handle locale routing
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
