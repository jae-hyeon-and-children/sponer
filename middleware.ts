import { NextRequest, NextResponse } from "next/server";
// import getSession from "./libs/session";
import { PATH_BRAND_USER, PATH_STYLIST_USER } from "./constants/variables";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/login": true,
  "/change-password": true,
  "/create-account": true,
};

const authenticatedOnlyUrls: Routes = {
  "/add-user": true,
  "/my-page": true,
  "/add-user/stylist-user": true,
  "/add-user/brand-user": true,
};

export async function middleware(request: NextRequest) {
  // const session = await getSession();
  // const isPublicPage = publicOnlyUrls[request.nextUrl.pathname];
  // const isAuthenticatedPage = authenticatedOnlyUrls[request.nextUrl.pathname];
  // if (!session.id) {
  //   if (isAuthenticatedPage) {
  //     // 세션이 없고, 인증된 사용자만 접근 가능한 페이지에 접근하려고 하면 로그인 페이지로 리다이렉트
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  //   // 세션이 없고, 비공개 페이지에 접근하려고 하면 로그인 페이지로 리다이렉트
  //   if (!isPublicPage) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // } else {
  //   if (isPublicPage) {
  //     // 세션이 있고, 공개 페이지에 접근하려고 하면 메인 페이지로 리다이렉트
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }
  // // 세션이 있는 경우와 없는 경우 모두 허용되는 페이지 접근 시에는 아무 동작도 하지 않음
  // return NextResponse.next();
}

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
