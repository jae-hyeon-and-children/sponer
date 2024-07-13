"use client";

import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import { auth } from "@/config/firebase/firebase";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LogOutButtonProps {
  children?: ReactNode;
}

export default function LogOutButton({ children }: LogOutButtonProps) {
  const router = useRouter();
  const { status } = useSession();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("세션 삭제 중 문제가 발생했습니다.");
      }

      await nextAuthSignOut({ redirect: true });
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("현재상태 : ", status);
      router.push("/login");
    }
  }, [status, router]);

  return (
    <button onClick={handleLogout} className="text-black hover:text-gray-300">
      {children ? children : "로그아웃"}
    </button>
  );
}
