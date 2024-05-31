"use client";

import { auth } from "@/config/firebase/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const LogOutButton = () => {
  const router = useRouter();

  const handleLogOut = async () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.removeItem("currentUser");
      }
    });
    await signOut(auth);
    console.log("User signed out", auth.currentUser);
    router.push("/login");
  };

  return <button onClick={handleLogOut}>로그아웃</button>;
};

export default LogOutButton;
