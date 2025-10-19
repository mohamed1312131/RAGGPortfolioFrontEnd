import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // No authentication check – just allow everything
  return NextResponse.next();
}

// Optional matcher – only run for these routes if you wish
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
