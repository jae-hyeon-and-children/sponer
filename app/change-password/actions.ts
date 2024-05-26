"use server";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";

export default async function ChangePassword(
  prevState: any,
  formData: FormData
) {
  const email = formData.get("email")?.toString() || "";

  if (!email) {
    return { success: false, message: "Email and password are required" };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("발송 완");
  } catch (e) {
    if (e instanceof FirebaseError) {
      return { success: false, message: e.message };
    }
    return { success: false, message: "Unknown error occurred" };
  }
  redirect("/login");
}
