// app/api/sendPushNotification/route.ts
import { NextResponse } from "next/server";
import { messaging } from "@/config/firebase/firebaseadmin";

export async function POST(req: Request) {
  try {
    const { token, title, body } = await req.json();

    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    const response = await messaging.send(message);
    console.log("FCM 메시지 전송 성공:", response);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("FCM 메시지 전송 실패:", error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
