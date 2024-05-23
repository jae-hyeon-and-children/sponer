// /login/googleLogin.tsx
"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { useRouter } from "next/navigation";
// import { FirebaseError } from "firebase/app";

export default function GoogleLoginButton() {
  const router = useRouter();
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.error(error);
      //   let errorMessage = "Unknown error occurred";
      //   if (error.code === "auth/account-exists-with-different-credential") {
      //     errorMessage = "이미 가입된 이메일 주소입니다.";
      //   } else if (error instanceof FirebaseError) {
      //     errorMessage = error.message;
      //   }
      //   alert(errorMessage);
    }
  };

  return <button onClick={handleGoogleLogin}>Login with Google</button>;
}
