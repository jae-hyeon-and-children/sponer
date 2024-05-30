"use client";

import { useState } from "react";
import Image from "next/image";
import Input from "@/components/global/input";
import Header from "@/components/global/header";

import useAuth from "@/libs/auth";
import { useEffect } from "react";
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
      <Header />
      <div className="flex justify-center max-w-screen-2xl pt-60">
        <div className="flex flex-col justify-around">
          <Image
            src="/ggobok222.png"
            alt="Logo"
            layout="fixed"
            width={852}
            height={814}
            className="cursor-pointer"
          />
        </div>
        <div className="flex flex-col m-auto items-start w-[852px] h-[814px] pl-[100px] gap-2 ">
          <Image
            src="/sponer_Logo.png"
            alt="Logo"
            layout="fixed"
            width={100}
            height={40}
            className="cursor-pointer items-center mt-20"
          />
          <form action={dispatch}>
            <div>
              <div className="display text-gray-900 text-[30px] mt-2 mb-2">
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
                  <div className="text-red-500 text-center mt-2">
                    {errorMessage}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center items-center text-center gap-2 mt-20">
                <button className="border bg-primary text-gray-100 rounded-[3.5rem] w-96 h-14 flex justify-center items-center">
                  <span className="label-1 text-gray-100">회원가입</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
