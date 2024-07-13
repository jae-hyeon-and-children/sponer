"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Input from "@/components/global/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "./google-login";

export default function LoginPageComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (status === "authenticated") {
    router.push("/");
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      console.log("로그인 시도 결과:", result);

      if (result?.error) {
        console.error("로그인 오류:", result.error);
        setErrorMessage(result.error);
      } else {
        // window.location.href = "/";
      }
    } catch (error) {
      console.error("로그인 요청 오류:", error);
      setErrorMessage("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center h-screen px-5">
      <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
        <div className="flex flex-col items-start w-full md:w-[50%] gap-2">
          <form onSubmit={handleSubmit} method="POST" className="w-full">
            <div className="display text-gray-900 text-[2rem] flex justify-center">
              로그인
            </div>
            <div className="flex flex-col gap-3 mt-14">
              <Input name="email" type="email" placeholder="이메일" required />
              <Input
                name="password"
                type="password"
                placeholder="비밀번호"
                required
              />
              <div className="flex flex-col items-end my-1 mr-3">
                <Link href="/change-password" className="label-2 text-gray-600">
                  비밀번호 찾기
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center gap-2 mt-2">
              <button className="box-border border bg-primary text-gray-100 rounded-xl w-full h-12 flex justify-center items-center">
                <span className="label-1 text-gray-100">로그인</span>
              </button>
              {errorMessage && (
                <div className="text-red-500 text-center mt-2">
                  {errorMessage}
                </div>
              )}
              <div className="border-[#C6D0DC] text-gray-600 rounded-xl w-full h-12 flex justify-center items-center mt-2">
                <GoogleLoginButton />
              </div>
            </div>
            <div className="flex justify-center mt-6 mr-3">
              <div className="label-2 text-gray-600 ">
                스포너가 처음이신가요?
              </div>
              <Link
                href="/create-account"
                className="label-2 text-gray-600 border-b-2 border-b[#81878E] ml-3"
              >
                간편 가입하기
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
