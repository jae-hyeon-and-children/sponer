// app/api/verify-token/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verify, JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface DecodedToken extends JwtPayload {
  uid: string;
}

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ message: "토큰이 없습니다" }, { status: 401 });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as DecodedToken;
    return NextResponse.json({ uid: decoded.uid }, { status: 200 });
  } catch (error) {
    console.error("JWT 검증 오류:", error);
    return NextResponse.json({ message: "토큰 검증 실패" }, { status: 401 });
  }
}
