"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface LogOutButtonProps {
  children?: ReactNode;
}

export default function LogOutButton({ children }: LogOutButtonProps) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <button onClick={handleLogout} className="text-black hover:text-gray-300">
      {children ? children : "로그아웃"}
    </button>
  );
}
