import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { serialize } from "cookie";
import { adminAuth } from "@/config/firebase/firebaseadmin";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json(
      {
        success: false,
        message: "유효한 ID 토큰이 필요합니다.",
      },
      { status: 400 }
    );
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("디코딩된 토큰:", decodedToken);

    const token = await new SignJWT({ uid: decodedToken.uid })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(JWT_SECRET));

    const cookie = serialize("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
      sameSite: "strict",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "성공적으로 로그인되었습니다.",
      },
      { status: 200 }
    );

    response.headers.set("Set-Cookie", cookie);
    return response;
  } catch (error) {
    console.error("토큰 발급 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "토큰 발급 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
