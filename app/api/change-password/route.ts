import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { adminAuth } from "@/config/firebase/firebaseadmin";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({
      status: 400,
      success: false,
      message: "Email is required",
    });
  }

  try {
    await adminAuth.getUserByEmail(email);
    await sendPasswordResetEmail(auth, email);
    return NextResponse.json({
      status: 200,
      success: true,
      message: "비밀번호 재설정 이메일을 발송했습니다. 이메일을 확인하세요.",
    });
  } catch (e: any) {
    if (e.code === "auth/user-not-found") {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "등록된 사용자가 아닙니다",
      });
    }
    return NextResponse.json({
      status: 400,
      success: false,
      message: e.message,
    });
  }
}
