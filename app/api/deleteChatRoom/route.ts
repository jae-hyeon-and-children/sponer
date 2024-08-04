import { NextRequest, NextResponse } from "next/server";
import { deleteChatRoom } from "@/libs/api/deleteChatRoom";

export async function POST(req: NextRequest) {
  try {
    const { chatRoomId } = await req.json();

    const response = await deleteChatRoom(chatRoomId);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting chat room:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
