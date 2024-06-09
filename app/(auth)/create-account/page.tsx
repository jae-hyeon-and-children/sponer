"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Input from "@/components/global/input";
import Header from "@/components/global/header";
import useAuth from "@/libs/auth";
import createaccount from "./actions";
import { IResponse } from "@/model/responses";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

export default function CreateAccount() {
  const router = useRouter();
  const user = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [currentState, dispatch] = useFormState(createaccount, null);

  useEffect(() => {
    const result: IResponse | null = currentState;
    if (result && !result.success) {
      setErrorMessage(result.message || "오류가 발생했습니다");
    }
  }, [currentState]);

  if (user) return null;

  return (
    <>
      <div className="flex flex-col items-center h-screen px-4 ">
        <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
          <div className="flex flex-col items-start h-screen-1/2 w-full md:w-[50%] gap-2">
            <Image
              src="/sponer_Logo.png"
              alt="Logo"
              width={100}
              height={40}
              className="items-center"
            />
            <form action={dispatch} className="w-full">
              <div className="display text-gray-900 text-[2rem]">
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
                {errorMessage && (
                  <div className="text-state-red text-center mt-2">
                    {errorMessage}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center items-center text-center gap-2 mt-20">
                <button className="border bg-primary text-gray-100 rounded-full w-96 h-14 flex justify-center items-center">
                  <span className="label-1 text-gray-100">회원가입</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
