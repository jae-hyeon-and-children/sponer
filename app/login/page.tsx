"use client";

import Image from "next/image";
import Link from "next/link";
import Input from "@/components/global/input";
import GoogleLoginButton from "./google-login";
import { useFormState } from "react-dom";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "@/libs/auth";
import Header from "@/components/global/header";
import { IResponse } from "@/model/responses";
import login from "./actions";

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
      <div className="flex flex-col items-center h-screen px-5 ">
        <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
          <div className="flex flex-col items-start w-full md:w-[50%] gap-2">
            <form action={dispatch} className="w-full">
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
                <div className="flex flex-col items-end my-2">
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
                  <button className="border bg-primary text-gray-100 rounded-xl w-full h-14 flex justify-center items-center">
                    <span className="label-1 text-gray-100">로그인</span>
                  </button>
                  {errorMessage && (
                    <div className="text-red-500 text-center mt-2">
                      {errorMessage}
                    </div>
                  )}
                  <div className="border text-gray-600 rounded-xl w-full h-14 flex justify-center items-center mt-2">
                    <GoogleLoginButton />
                  </div>
                </div>
                <div className="flex mt-3 ">
                  <div className="label-2 text-gray-600">
                    스포너가 처음이신가요?
                  </div>

                  <Link
                    href="/create-account"
                    className="label-2 text-gray-600 border-b-2 ml-3"
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
