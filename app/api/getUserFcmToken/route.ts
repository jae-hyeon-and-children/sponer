import { NextResponse } from "next/server";
import { adminFirestore } from "@/config/firebase/firebaseadmin";

export async function POST(req: Request) {
  try {
    const { chatRoomId, senderId } = await req.json();
    if (!chatRoomId || !senderId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const chatRoomDoc = await adminFirestore
      .collection("Chat")
      .doc(chatRoomId)
      .get();
    if (!chatRoomDoc.exists) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    const chatRoomData = chatRoomDoc.data();
    const recipientId = chatRoomData?.userIds.find(
      (id: string) => id !== senderId
    );
    if (!recipientId) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      );
    }

    const tokenDoc = await adminFirestore
      .collection("UserFcmToken")
      .doc(recipientId)
      .get();
    if (!tokenDoc.exists) {
      return NextResponse.json(
        { error: "Recipient token not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      token: tokenDoc.data()?.fcmToken,
    });
  } catch (error) {
    console.error("Error fetching recipient token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
