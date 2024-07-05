// app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  const cookie = serialize("accessToken", "", {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    maxAge: -1,
    path: "/",
    sameSite: "strict",
  });

  const response = NextResponse.json(
    {
      success: true,
      message: "성공적으로 로그아웃되었습니다.",
    },
    { status: 200 }
  );

  response.headers.set("Set-Cookie", cookie);
  return response;
}
