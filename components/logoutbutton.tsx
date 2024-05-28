"use client";

import { auth } from "@/config/firebase/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.removeItem("currentUser");
      }
    });
    await signOut(auth);
    console.log("User signed out", auth.currentUser);
    router.push("/login");
  };

  return <button onClick={handleSignOut}>로그아웃</button>;
};

export default SignOutButton;
