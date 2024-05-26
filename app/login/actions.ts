import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";

export default async function login(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return { success: false, message: "Email과 Password가 필요합니다." };
  }

  try {
    // 사용자 로그인
    const loginUser = await signInWithEmailAndPassword(auth, email, password);

    // 로그인한 사용자의 UID 가져오기
    const uid = auth.currentUser?.uid || "";

    // 사용자 정보 업데이트 등 다른 작업 수행

    console.log("로그인 유저 UID:", uid);

    // 사용자 상태가 변경될 때까지 대기
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          unsubscribe();
          resolve(user);
        }
      });
    });

    if (!auth.currentUser?.emailVerified) {
      return { success: false, message: "이메일이 확인되지 않았습니다." };
    }

    await updateProfile(loginUser.user, {});
  } catch (e) {
    if (e instanceof FirebaseError) {
      return { success: false, message: e.message };
    }
    return { success: false, message: "알 수 없는 오류가 발생했습니다." };
  }
  redirect("/");
}
