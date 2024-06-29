import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { adminAuth } from "@/config/firebase/firebaseadmin";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (!decodedToken || !decodedToken.uid) {
      throw new Error("Invalid ID token");
    }

    const uid = decodedToken.uid;
    const token = sign({ uid }, JWT_SECRET, { expiresIn: "1h" });

    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    const response = NextResponse.json({
      status: 200,
      success: true,
      message: "성공적으로 로그인되었습니다.",
    });
    response.headers.set("Set-Cookie", cookie);
    return response;
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
}
