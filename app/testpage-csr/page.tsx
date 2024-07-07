"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TestPageCSR() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie;
    const token = cookies
      .split("; ")
      .find((row) => row.startsWith("accessTokenClient="))
      ?.split("=")[1];

    console.log("CSR 쿠키:", cookies);
    console.log("CSR 토큰:", token);

    if (token) {
      setIsAuthenticated(true);
      setUser({ name: "John Doe" });
    } else {
      setIsAuthenticated(false);
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <div>scr page test</div>
      <div>scr page test</div>
      <div>scr page test</div>
      <div>scr page test</div>
      <div>scr page test</div>
      <div>scr page test</div>
      <div>scr page test</div>
    </div>
  );
}
