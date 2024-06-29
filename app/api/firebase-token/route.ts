// api/firebase-token/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { doc, getDoc } from "firebase/firestore";
import { fireStore } from "@/config/firebase/firebase";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface DecodedToken {
  uid: string;
}

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ message: "토큰이 없습니다" }, { status: 401 });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as DecodedToken;
    const uid = decoded.uid;

    // Firestore에서 userType을 가져옵니다.
    const userDocRef = doc(fireStore, "User", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return NextResponse.json(
        { message: "유효하지 않은 사용자입니다" },
        { status: 401 }
      );
    }

    const userType = userDocSnap.data()?.userType;

    return NextResponse.json({ uid, userType }, { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
