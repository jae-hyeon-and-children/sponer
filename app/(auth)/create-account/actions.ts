"use server";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";

export default async function createaccount(
  prevState: any,
  formData: FormData
) {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    console.log(email, password);
    return { success: false, message: "Email and password are required" };
  }

  try {
    const createUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(createUser);

    // await sendEmailVerification(createUser.user);

    await updateProfile(createUser.user, {});
  } catch (e) {
    if (e instanceof FirebaseError) {
      console.log(e);
      return { success: false, message: e.message };
    }
    return {
      success: false,
      message: "ㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷ",
    };
  }
  redirect("/login");
}
