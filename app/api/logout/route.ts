import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import getSession from "@/libs/session";

export async function POST(req: NextRequest) {
  const session = await getSession();

  try {
    session.destroy();
    console.log("세션이 정상적으로 삭제되었습니다.");

    // 쿠키 삭제를 위한 설정
    const cookie = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // 쿠키 삭제
      path: "/",
    });

    const response = NextResponse.json({ success: true });
    response.headers.set("Set-Cookie", cookie);
    return response;
  } catch (error) {
    console.error("세션 삭제 오류:", error);
    return NextResponse.json(
      { success: false, error: "세션 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
