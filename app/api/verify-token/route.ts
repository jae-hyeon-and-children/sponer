import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { doc, getDoc } from "firebase/firestore";
import { fireStore } from "@/config/firebase/firebase";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function verifyTokenAndGetUser(token: string) {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(JWT_SECRET)
  );
  const uid = payload.uid as string;

  const userDocRef = doc(fireStore, "User", uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    throw new Error("유효하지 않은 사용자입니다");
  }

  const userType = userDocSnap.data()?.userType;
  return { uid, userType };
}

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { message: "유효한 토큰이 없습니다" },
      { status: 401 }
    );
  }

  try {
    const { uid, userType } = await verifyTokenAndGetUser(token);
    return NextResponse.json({ uid, userType }, { status: 200 });
  } catch (error) {
    console.error("토큰 검증 오류:", error);
    return NextResponse.json({ message: "토큰 검증 실패" }, { status: 401 });
  }
}
