import { NextRequest, NextResponse } from "next/server";
import { createAccountHandler } from "@/app/(auth)/create-account/actions";

export async function POST(req: NextRequest) {
  try {
    const { userId, email, profileImage, token, name } = await req.json();
    const response = await createAccountHandler(
      userId,
      email,
      profileImage,
      token,
      name
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
}
