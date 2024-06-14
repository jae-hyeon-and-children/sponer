"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
// import getSession from "@/libs/session";

interface LogOutButtonProps {
  children?: ReactNode;
}

export default function LogOutButton({ children }: LogOutButtonProps) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut(auth);

      // const session = await getSession();
      // session.destroy();
      console.log("로그아웃 성공");
      router.push("/login");
    } catch (error) {
      console.log("이미 로그아웃되었거나 세션이 없습니다.");
      console.error("Error logging out: ", error);
    }
  };

  return (
    <button onClick={handleLogout} className="text-black hover:text-gray-300">
      {children ? children : "로그아웃"}
    </button>
  );
}
