// /login/actions.ts
"use server";

import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";

// 일반 로그인 처리 함수
export default async function login(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  try {
    const loginUser = await signInWithEmailAndPassword(auth, email, password);
    console.log(loginUser);
    if (!auth.currentUser?.emailVerified) {
      return { success: false, message: "Email is not verified" };
    }

    await updateProfile(loginUser.user, {});
  } catch (e) {
    if (e instanceof FirebaseError) {
      return { success: false, message: e.message };
    }
    return { success: false, message: "Unknown error occurred" };
  }
  redirect("/");
}
