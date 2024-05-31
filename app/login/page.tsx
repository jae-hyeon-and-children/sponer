"use client";

import Image from "next/image";
import Link from "next/link";
import Input from "@/components/global/input";
import GoogleLoginButton from "./google-login";
import { useFormState } from "react-dom";
import login from "./actions";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "@/libs/auth";
import Header from "@/components/global/header";
import { IResponse } from "@/model/responses";

export default function Login() {
  const router = useRouter();

  const user = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [currentState, dispatch] = useFormState(login, null);
  useEffect(() => {
    const result: IResponse | null = currentState;
    if (result && !result.success) {
      setErrorMessage(result.message || "오류가 발생했습니다");
    }
  }, [currentState]);

  if (user) return null;

  return (
    <>
      <Header />
      <div className="flex justify-center max-w-screen-2xl pt-60">
        <div className="flex flex-col justify-around">
          <Image
            src="/ggobok222.png"
            alt="Logo"
            layout="fixed"
            width={852}
            height={814}
          />
        </div>
        <div className="flex flex-col m-auto items-start w-[852px] h-[814px] pl-[100px] gap-2 ">
          <Image
            src="/sponer_Logo.png"
            alt="Logo"
            layout="fixed"
            width={100}
            height={40}
            className=" items-center mt-20"
          />
          <form action={dispatch}>
            <div>
              <div className="display text-gray-900 text-[2rem] mt-2 mb-3">
                스포너에 오신 것을 환영합니다
              </div>
              <div className="flex flex-col gap-5 mt-14">
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
              </div>
              <div className="flex flex-col justify-center items-center text-center gap-2 mt-4">
                <div className="flex flex-col justify-center items-center text-center gap-2 mt-10">
                  <button className="border bg-primary text-gray-100 rounded-[3.5rem] w-96 h-14 flex justify-center items-center">
                    <span className="label-1 text-gray-100">로그인</span>
                  </button>
                  {errorMessage && (
                    <div className="text-red-500 text-center mt-2">
                      {errorMessage}
                    </div>
                  )}
                  <div className="border text-gray-700 rounded-[3.5rem] w-96 h-14 flex justify-center items-center mt-2">
                    <GoogleLoginButton />
                  </div>
                </div>
                <div className="flex gap-3 mt-10 font-light">
                  <Link
                    href="/create-account"
                    className="label-2 text-gray-600"
                  >
                    회원가입
                  </Link>
                  <div className="label-2">/</div>
                  <Link
                    href="/change-password"
                    className="label-2  text-gray-600"
                  >
                    비번찾기
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
