import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Strict RBAC Enforcement
    
    // 1. Admin access (Only HR_ADMIN)
    if (path.startsWith("/dashboard/admin")) {
      if (token?.role !== "HR_ADMIN") {
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
    }

    // 2. Manager access (HR_ADMIN, PLANT_HEAD, SHIFT_MANAGER)
    if (path.startsWith("/dashboard/manager")) {
      const allowedRoles = ["HR_ADMIN", "PLANT_HEAD", "SHIFT_MANAGER"];
      if (!allowedRoles.includes(token?.role as string)) {
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true if the user is authenticated
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Define which paths are protected by this middleware
export const config = {
  matcher: ["/dashboard/:path*"],
};
