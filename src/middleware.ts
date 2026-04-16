import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = req.nextUrl.pathname === "/admin/login";

    // 已登入但訪問 login 頁 → 導向 dashboard
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // 訪問 admin 頁但非 ADMIN 角色 → 導向 login
    if (isAdminRoute && !isLoginPage && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isLoginPage = req.nextUrl.pathname === "/admin/login";
        // login 頁不需要 token
        if (isLoginPage) return true;
        // 其他 admin 頁需要 token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
