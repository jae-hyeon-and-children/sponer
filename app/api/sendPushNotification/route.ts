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
    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
