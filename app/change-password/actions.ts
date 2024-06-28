"use server";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import admin from "firebase-admin";
import { IResponse } from "@/model/responses";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export default async function ChangePassword(
  formData: FormData
): Promise<IResponse> {
  const email = formData.get("email")?.toString() || "";

  if (!email) {
    return {
      status: 400,
      success: false,
      message: "Email is required",
    };
  }

  try {
    await admin.auth().getUserByEmail(email);
    await sendPasswordResetEmail(auth, email);
    return {
      status: 200,
      success: true,
      message: "비밀번호 재설정 이메일을 발송했습니다. 이메일을 확인하세요.",
    };
  } catch (e: any) {
    if (e.code === "auth/user-not-found") {
      return {
        status: 400,
        success: false,
        message: "등록된 사용자가 아닙니다",
      };
    }
    return { status: 400, success: false, message: e.message };
  }
}
