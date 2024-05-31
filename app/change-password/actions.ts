"use server";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";
import { IResponse } from "@/model/responses";

export default async function ChangePassword(
  prevState: any,
  formData: FormData
): Promise<IResponse> {
  const email = formData.get("email")?.toString() || "";

  if (!email) {
    return {
      status: 400,
      success: false,
      message: "Email and password are required",
    };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return {
      status: 200,
      success: true,
      message: "해당 이메일에 링크를 발송하였습니다.",
    };
  } catch (e) {
    if (e instanceof FirebaseError) {
      return { status: 400, success: false, message: e.message };
    }
    return { status: 400, success: false, message: "등록된 사용자가 아닙니다" };
  }
}
