import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const publicOnlyUrls = [
  "/login",
  "/change-password",
  "/create-account",
  "/my-page/faq",
];

const authenticatedOnlyUrls = [
  "/add-user",
  "/add-user/stylist-user",
  "/add-user/brand-user",
  "/chats",
  "/my-page",
  "/my-page/product-list",
  "/my-page/product",
];

const isAuthenticatedUrl = (pathname: string): boolean => {
  if (authenticatedOnlyUrls.includes(pathname)) {
    return true;
  }

  const dynamicRoutes = [
    /^\/my-page\/(?!faq|product-list|product)([^/]+)$/,
    /^\/chats\/[^/]+$/,
    /^\/my-page\/product\/[^/]+$/,
  ];
  return dynamicRoutes.some((regex) => regex.test(pathname));
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  console.log("미들웨어 토큰 : ", token);
  console.log("패스네임 : ", pathname);

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isPublicPage = publicOnlyUrls.includes(pathname);
  const isAuthenticatedPage = isAuthenticatedUrl(pathname);

  if (!token) {
    console.log("토큰 없음. 리다이렉트.");
    if (isAuthenticatedPage) {
      const redirectUrl = new URL(
        `/login?redirect_url=${pathname}`,
        request.url
      );
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const { uid } = payload;

    if (isPublicPage) {
      if (pathname === "/my-page/faq") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL(`/my-page/${uid}`, request.url));
    }

    if (isAuthenticatedPage) {
      const verifyUrl = new URL("/api/verify-token", request.url);
      const response = await fetch(verifyUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("JWT 검증 오류");
      }

      const { userType } = await response.json();

      if (
        userType === "stylist" &&
        (pathname.startsWith("/my-page/product-list") ||
          pathname.startsWith("/my-page/product") ||
          pathname.match(/^\/my-page\/product\/[^/]+$/))
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (pathname.match(/^\/my-page\/product\/[^/]+$/)) {
        const productId = pathname.split("/").pop();
        const productAccessUrl = new URL("/api/product-access", request.url);
        const accessResponse = await fetch(productAccessUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, productId }),
        });

        if (!accessResponse.ok) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }

      return NextResponse.next();
    }
  } catch (error) {
    console.error("JWT 검증 오류:", error);
    if (isAuthenticatedPage) {
      const redirectUrl = new URL(
        `/login?redirect_url=${pathname}`,
        request.url
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
