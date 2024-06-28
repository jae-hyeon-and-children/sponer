import { NextRequest, NextResponse } from "next/server";

interface DecodedToken {
  uid: string;
}

interface Routes {
  [key: string]: boolean;
}

// 공개 접근 가능 URL
const publicOnlyUrls: Routes = {
  "/login": true,
  "/change-password": true,
  "/create-account": true,
  "/my-page/faq": true,
};

// 인증된 사용자만 접근 가능한 URL
const authenticatedOnlyUrls: Routes = {
  "/add-user": true,
  "/add-user/stylist-user": true,
  "/add-user/brand-user": true,
  "/chats": true,
  "/my-page": true,
  "/my-page/product-list": true,
  "/my-page/product": true,
};

const isAuthenticatedUrl = (pathname: string): boolean => {
  if (authenticatedOnlyUrls[pathname]) {
    return true;
  }

  // UID를 포함한 동적 경로 처리
  const dynamicRoutes = [
    /^\/my-page\/(?!faq|product-list|product)([^/]+)$/,
    /^\/chats\/[^/]+$/,
    /^\/my-page\/product\/[^/]+$/, // 상품 수정 경로
  ];
  return dynamicRoutes.some((regex) => regex.test(pathname));
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;
  const isPublicPage = publicOnlyUrls[pathname] || false;
  const isAuthenticatedPage = isAuthenticatedUrl(pathname);

  console.log(`Request URL: ${pathname}`);
  console.log(`Token: ${token}`);
  console.log(`isPublicPage: ${isPublicPage}`);
  console.log(`isAuthenticatedPage: ${isAuthenticatedPage}`);

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!token) {
    if (isAuthenticatedPage) {
      console.log("Redirecting to /login because no token found");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    try {
      const verifyUrl = `${request.nextUrl.origin}/api/verify-token`;
      console.log(`Verify URL: ${verifyUrl}`);
      const response = await fetch(verifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      console.log(`Response Status: ${response.status}`);

      if (!response.ok) {
        throw new Error("JWT 검증 오류");
      }

      const { uid } = await response.json();
      console.log(`User ID from token: ${uid}`);

      if (isPublicPage) {
        if (pathname === "/my-page/faq") {
          return NextResponse.next();
        }
        console.log("Redirecting to my-page with uid");
        return NextResponse.redirect(new URL(`/my-page/${uid}`, request.url));
      }

      if (pathname === "/add-user") {
        console.log("Allowing access to /add-user");
        return NextResponse.next();
      }

      const pathUidMatch = pathname.match(
        /^\/my-page\/(?!faq|product-list|product)([^/]+)$/
      );
      if (pathUidMatch) {
        if (pathUidMatch[1] === uid) {
          console.log("Allowing access to dynamic my-page route");
          return NextResponse.next();
        } else {
          console.log(`Unauthorized access attempt to ${pathname}`);
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }

      if (pathname.startsWith("/my-page/product/")) {
        const productId = pathname.split("/").pop();
        const productAccessUrl = `${request.nextUrl.origin}/api/product-access`;
        const accessResponse = await fetch(productAccessUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, productId }),
        });

        console.log(`Product Access Response Status: ${accessResponse.status}`);

        if (!accessResponse.ok) {
          throw new Error("Product access 검증 오류");
        }

        const { message } = await accessResponse.json();
        console.log(`Product Access Message: ${message}`);
      }

      if (pathname === "/my-page/product") {
        const brandAccessUrl = `${request.nextUrl.origin}/api/brand-access`;
        const accessResponse = await fetch(brandAccessUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        console.log(`Brand Access Response Status: ${accessResponse.status}`);

        if (!accessResponse.ok) {
          throw new Error("Brand access 검증 오류");
        }

        const { message } = await accessResponse.json();
        console.log(`Brand Access Message: ${message}`);
      }

      if (pathname === "/my-page/product-list") {
        const brandAccessUrl = `${request.nextUrl.origin}/api/brand-access`;
        const accessResponse = await fetch(brandAccessUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        console.log(`Brand Access Response Status: ${accessResponse.status}`);

        if (!accessResponse.ok) {
          throw new Error("Brand access 검증 오류");
        }

        const { message } = await accessResponse.json();
        console.log(`Brand Access Message: ${message}`);
      }

      if (isAuthenticatedPage) {
        console.log("Allowing access to authenticated page");
        return NextResponse.next();
      }
    } catch (error) {
      console.error("JWT 검증 오류:", error);
      if (isAuthenticatedPage) {
        console.log("Redirecting to /login due to JWT 검증 오류");
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  console.log("Allowing access to public or other pages");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
