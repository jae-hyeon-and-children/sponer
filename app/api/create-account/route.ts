import { NextRequest, NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { createAccountHandler } from "@/app/(auth)/create-account/actions";
import { adminAuth } from "@/config/firebase/firebaseadmin";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    const { userId, email, profileImage } = await req.json();
    const authorizationHeader = req.headers.get("authorization") || "";
    const token = authorizationHeader.split(" ")[1];

    console.log("Received create account request:", {
      userId,
      email,
      profileImage,
    });

    const decodedToken = await adminAuth.verifyIdToken(token);
    if (decodedToken.uid !== userId) {
      throw new Error("유효하지 않은 토큰");
    }

    const response = await createAccountHandler(
      userId,
      email,
      profileImage,
      token
    );

    if (response.status === 200) {
      const newToken = sign({ uid: userId }, JWT_SECRET, {
        expiresIn: "1h",
        algorithm: "HS256",
      });
      const cookie = serialize("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
        path: "/",
      });
      const res = NextResponse.json(response, { status: response.status });
      res.headers.set("Set-Cookie", cookie);
      return res;
    }

    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "예상치 못한 에러가 발생했습니다.",
    });
  }
}
