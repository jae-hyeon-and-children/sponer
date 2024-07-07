import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { adminAuth } from "@/config/firebase/firebaseadmin";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const token = await new SignJWT({ uid: decodedToken.uid })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(JWT_SECRET));

    //이래도 못읽나
    const httpOnlyCookie = serialize("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
    });

    //이래도 못읽나 해보자 씨부레
    const nonHttpOnlyCookie = serialize("accessTokenClient", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
    });

    const response = NextResponse.json({
      success: true,
      message: "성공적으로 로그인되었습니다.",
      token,
    });

    response.headers.set("Set-Cookie", httpOnlyCookie);
    response.headers.append("Set-Cookie", nonHttpOnlyCookie);

    return response;
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json({ success: false, message: "로그인 실패" });
  }
}
