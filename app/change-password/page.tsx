"use client";

import { useState } from "react";
import Input from "@/components/global/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/libs/auth";
import { useEffect } from "react";
import ChangePassword from "./actions";

export default function ChangePasswordPage() {
  const router = useRouter();
  const user = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("email", email);

      const result = await ChangePassword(formData);

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

  if (user) return null;

  return (
    <>
      <div className="flex flex-col items-center h-screen px-4">
        <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
          <div className="flex flex-col items-start w-full md:w-[50%] gap-2">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="text-gray-900 text-[2rem] flex justify-center">
                비밀번호 찾기
              </div>
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
                  <div className="text-green-500 text-center mt-2">
                    {message}
                  </div>
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
          </div>
        </div>
      </div>
    </>
  );
}
