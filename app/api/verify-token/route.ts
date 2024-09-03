import { adminAuth } from "@/config/firebase/firebaseadmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  console.log("token :", token);

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log("decodedToken :", decodedToken);
    return NextResponse.json({ uid: decodedToken.uid }, { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
