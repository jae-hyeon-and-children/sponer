import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";
import { IResponse } from "@/model/responses";

export default async function login(
  prevState: any,
  formData: FormData
): Promise<IResponse> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return {
      status: 400,
      success: false,
      message: "Email과 Password가 필요합니다.",
    };
  }

  try {
    const loginUser = await signInWithEmailAndPassword(auth, email, password);

    const uid = auth.currentUser?.uid || "";

    console.log("로그인 유저 UID:", uid);
    auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            phtoURL: user.photoURL,
          })
        );
      }
    });
    // if (!auth.currentUser?.emailVerified) {
    //   return {status: 400, success: false, message: "이메일이 확인되지 않았습니다." };
    // }

    await updateProfile(loginUser.user, {});
    return {
      status: 200,
      success: true,
      message: "성공적으로 로그인 되셨습니다.",
    };
  } catch (e) {
    if (e instanceof FirebaseError) {
      return {
        status: 400,
        success: false,
        message: "올바른 양식이 아닙니다.",
      };
    }
    return {
      status: 400,
      success: false,
      message: "알 수 없는 오류가 발생했습니다.",
    };
  }
}
