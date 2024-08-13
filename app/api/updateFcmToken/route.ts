import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/auth";
import { adminFirestore } from "@/config/firebase/firebaseadmin";

// API 경로의 POST 핸들러 정의
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, token } = await req.json();
  if (!userId || !token) {
    return NextResponse.json(
      { error: "Bad Request: Missing parameters" },
      { status: 400 }
    );
  }

  try {
    const tokenRef = adminFirestore.collection("UserFcmToken").doc(userId);
    const doc = await tokenRef.get();
    if (!doc.exists || doc.data()?.fcmToken !== token) {
      await tokenRef.set({ fcmToken: token }, { merge: true });
      console.log("FCM 토큰이 성공적으로 업데이트되었습니다.");
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: "토큰이 변경되지 않았습니다." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("FCM 토큰 업데이트 실패:", error);
    return NextResponse.json(
      { error: "FCM 토큰 업데이트 실패", details: error },
      { status: 500 }
    );
  }
}
