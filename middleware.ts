import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  console.log("미들웨어 토큰:", token);
  console.log("패스네임:", pathname);

  if (pathname === "/login" && token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      console.error("JWT 검증 오류:", error);
    }
  }

  if (["/testpage", "/add-user"].includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/testpage", "/add-user", "/login"],
};
