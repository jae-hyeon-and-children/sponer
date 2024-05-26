"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { setCookie } from "nookies";

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

// useEffect(() => {
//   auth.onAuthStateChanged(async (user) => {
//     const currentUser = auth.currentUser;

//     if (!currentUser) return;
//     setCookie("uid", currentUser.uid, 1);
//   });
// }, []); // 빈 배열로 설정하여 최초 렌더링 시에만 실행되도록 함
