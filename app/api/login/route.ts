import { NextRequest, NextResponse } from "next/server";
import { loginHandler } from "@/app/login/actions";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  console.log("POST /api/login called");
  const { uid } = await req.json();

  const response = await loginHandler(uid);

  console.log("로그인 핸들러 응답:", response);

  if (response.status === 200 && response.token) {
    const cookie = serialize("token", response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    const res = NextResponse.json(response, { status: response.status });
    res.headers.set("Set-Cookie", cookie);
    return res;
  }

  return NextResponse.json(response, { status: response.status });
}
