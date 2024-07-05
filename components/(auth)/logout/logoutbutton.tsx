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

      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("세션 삭제 중 문제가 발생했습니다.");
      }

      console.log("로그아웃 성공");
      window.location.href = "/login"; // 로그아웃 후 로그인 페이지로 리디렉션
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
