import { uploadStylistUser } from "@/app/add-user/stylist-user/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request");
    const formData = await req.formData();
    const uid = formData.get("uid") as string;

    if (!uid) {
      console.log("No UID in form data");
      return NextResponse.json({
        status: 400,
        success: false,
        message: "유효하지 않은 사용자입니다.",
      });
    }

    console.log("Calling uploadStylistUser with UID:", uid);
    const response = await uploadStylistUser(uid, formData);
    console.log("Response from uploadStylistUser:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
}
