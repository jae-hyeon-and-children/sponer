"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("로그인 유저 : ", auth.currentUser);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleGoogleLogin}>Login with Google</button>;
}
