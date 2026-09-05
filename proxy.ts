import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except the ones starting with:
     * - _next (static files, image optimization)
     * - favicon.ico (favicon file)
     */
    "/((?!_next|favicon.ico).*)",
  ],
};