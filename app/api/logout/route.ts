// app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  const cookiesToClear = [
    "accessToken",
    "next-auth.session-token",
    "next-auth.csrf-token",
    "next-auth.callback-url",
    "next-auth.pkce.code_verifier",
  ];

  const cookies = cookiesToClear.map((cookieName) =>
    serialize(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: -1,
      path: "/",
      sameSite: "lax",
    })
  );

  const response = NextResponse.json(
    {
      success: true,
      message: "성공적으로 로그아웃되었습니다.",
    },
    { status: 200 }
  );

  cookies.forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
  });

  return response;
}
