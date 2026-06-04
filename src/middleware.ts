import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin pages and admin API — require ADMIN role
    const isAdminPath =
      pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

    if (isAdminPath) {
      if (!token) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      if (token.role !== "ADMIN") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Admin paths: must be logged in (role checked above)
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/api/admin")
        ) {
          return !!token;
        }

        // Customer-only paths
        if (
          pathname.startsWith("/checkout") ||
          pathname.startsWith("/profile") ||
          pathname.startsWith("/api/orders")
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/api/admin/:path*",
    "/api/orders/:path*",
  ],
};
