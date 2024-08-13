import { NextResponse } from "next/server";
import { adminFirestore } from "@/config/firebase/firebaseadmin";

export async function POST(req: Request) {
  const { userId, token: newToken } = await req.json();
  console.log(
    `Received token update request for user ${userId} with token ${newToken}`
  );

  if (!userId || !newToken) {
    console.error("Invalid data received: ", { userId, newToken });
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const tokenRef = adminFirestore.collection("UserFcmToken").doc(userId);
  const doc = await tokenRef.get();

  if (!doc.exists || doc.data()?.fcmToken !== newToken) {
    console.log(`Token mismatch or new token, updating...`);
    await tokenRef.set({ fcmToken: newToken }, { merge: true });
    console.log(`토큰 업데이트 성공 ${userId}`);
    return NextResponse.json({ success: true });
  } else {
    console.log(`Token for user ${userId} has not changed.`);
    return NextResponse.json({
      success: false,
      message: "Token not changed",
    });
  }
}
