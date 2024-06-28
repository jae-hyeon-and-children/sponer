"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import useAuth from "@/libs/auth";
import Input from "@/components/global/input";
import GoogleLoginButton from "./google-login";
import { IResponse } from "@/model/responses";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const user = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!email || !password) {
      setErrorMessage("Email과 Password가 필요합니다.");
      return;
    }

    try {
      const loginUser = await signInWithEmailAndPassword(auth, email, password);
      const uid = loginUser.user.uid;
      console.log("로그인 성공, UID:", uid);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid }),
      });

      if (!response.ok) {
        throw new Error("로그인 요청 중 문제가 발생했습니다.");
      }

      const result: IResponse = await response.json();
      console.log("서버 응답:", result);

      if (result.success) {
        router.push("/");
      } else {
        setErrorMessage(result.message || "오류가 발생했습니다");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setErrorMessage(
        "아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요."
      );
    }
  };

  if (user) return null;

  return (
    <>
      <div className="flex flex-col items-center h-screen px-5">
        <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
          <div className="flex flex-col items-start w-full md:w-[50%] gap-2">
            <form onSubmit={handleSubmit} method="POST" className="w-full">
              <div className="display text-gray-900 text-[2rem] flex justify-center">
                로그인
              </div>
              <div className="flex flex-col gap-3 mt-14">
                <Input
                  name="email"
                  type="email"
                  placeholder="이메일"
                  required
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="비밀번호"
                  required
                />
                <div className="flex flex-col items-end my-1 mr-3">
                  <Link
                    href="/change-password"
                    className="label-2 text-gray-600"
                  >
                    비밀번호 찾기
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center text-center gap-2 mt-2">
                <div className="flex flex-col justify-center items-center text-center gap-2 mt-2 w-full">
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
                <div className="flex mt-3">
                  <div className="label-2 text-gray-600">
                    스포너가 처음이신가요?
                  </div>
                  <Link
                    href="/create-account"
                    className="label-2 text-gray-600 border-b-2 border-b[#81878E] ml-3"
                  >
                    간편 가입하기
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
