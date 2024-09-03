import { NextResponse } from "next/server";
import { messaging } from "@/config/firebase/firebaseadmin";
import { getServerSession } from "next-auth";
import authOptions from "@/auth";
import { number } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.error("인증 오류: 세션이 존재하지 않습니다.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      token: recipientToken,
      title,
      body,
      senderId,
      senderToken,
      link,
    } = await req.json();
    console.log(
      `알림 전송 요청 받음, 발신자 ID: ${senderId}, 세션 사용자 ID: ${session.user.id}`
    );

    console.log(
      `발신자 토큰: ${senderToken}여기까지 발신자이고, 여기서부턴 수신자 토큰: ${recipientToken}수신자 `
    );

    // 발신자와 수신자의 FCM 토큰이 다를 경우에만 알림을 전송
    if (senderToken !== recipientToken) {
      console.log("다른 사용자에게 알림을 전송합니다.");
      const message = {
        notification: {
          title,
          body,
        },
        token: recipientToken,
        webpush: link ? { fcmOptions: { link } } : undefined,
      };

      const response = await messaging.send(message);
      console.log("FCM 메시지 성공적으로 전송됨:", response);
      return NextResponse.json({ success: true, response });
    }

    // 발신자와 수신자가 같은 경우 알림이 필요 없음
    console.log("알림 요청 무시됨: 발신자와 수신자 토큰이 동일합니다.");
    return NextResponse.json(
      { success: false, message: "알림이 필요하지 않습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("FCM 메시지 전송 실패:", error);
    return NextResponse.json(
      { success: false, error: `FCM 메시지 전송 실패: ㅇㅇㅇㅇ` },
      { status: 500 }
    );
  }
}

// 이건 다른 병합 확인용
