"use client";

import { useState, useEffect } from "react";
import Input from "@/components/global/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function ChangePasswordPageSkeleton() {
  return (
    <main className="flex flex-col items-center h-screen px-4 animate-pulse">
      <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
        <section className="flex flex-col items-start w-full md:w-[50%] gap-2">
          <div className="w-full">
            <h1 className="text-gray-300 text-[2rem] flex justify-center mb-10">
              비밀번호 찾기
            </h1>
            <div className="flex flex-col gap-5 mt-10">
              <div className="w-full bg-gray-200 h-10 rounded"></div>
            </div>
            <div className="flex flex-col justify-center items-center text-center gap-2 mt-5">
              <div className="border bg-gray-300 text-gray-300 rounded-xl w-full h-14 flex justify-center items-center"></div>
              <div className="mt-10 label-2 text-gray-300 w-full h-5 rounded">
                {/* 로그인 페이지로 이동하기 */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ChangePasswordPageForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(result.message!);
      } else {
        setErrorMessage(result.message!);
      }
    } catch (error: any) {
      console.error("비밀번호 재설정 오류:", error);
      setErrorMessage("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (status === "loading") return <ChangePasswordPageSkeleton />;

  return (
    <main className="flex flex-col items-center h-screen px-4">
      <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
        <section className="flex flex-col items-start w-full md:w-[50%] gap-2">
          <form onSubmit={handleSubmit} className="w-full">
            <h1 className="text-gray-900 text-[2rem] flex justify-center">
              비밀번호 찾기
            </h1>
            <div className="flex flex-col gap-5 mt-10">
              <Input
                name="email"
                type="email"
                placeholder="이메일"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {message && (
                <div className="text-green-500 text-center mt-2">{message}</div>
              )}
              {errorMessage && (
                <div className="text-red-500 text-center mt-2">
                  {errorMessage}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center items-center text-center gap-2 mt-5">
              <button className="border bg-primary text-gray-100 rounded-xl w-full h-14 flex justify-center items-center">
                <span className="label-1 text-gray-100">
                  비밀번호 재설정 메일 받기
                </span>
              </button>
              <Link className="mt-10 label-2 text-gray-600" href="/login">
                로그인 페이지로 이동하기 &rarr;
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
