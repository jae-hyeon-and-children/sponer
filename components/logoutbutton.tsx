"use client";

import { auth } from "@/config/firebase/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    console.log("User signed out", auth.currentUser); // 로그아웃 확인용 콘솔 로그
    router.push("/");
  };

  return <button onClick={handleSignOut}>로그아웃</button>;
};

export default SignOutButton;
