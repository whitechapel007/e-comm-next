import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware function to check if a user is authorized
 * Supports role-based access for admin and dashboard routes
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    const token = req.nextauth.token;

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      if (!token) {
        // Not logged in → redirect to login
        const url = req.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
      } else if (token.role !== "ADMIN") {
        // Logged in but not admin → show unauthorized page
        const url = req.nextUrl.clone();
        url.pathname = "/unauthorized";
        return NextResponse.rewrite(url);
      }
    }

    // Protect dashboard routes (any authenticated user)
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
      }
    }

    // Everything else allowed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname.startsWith("/admin")) {
          return !!token; // middleware will handle role check
        }

        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
