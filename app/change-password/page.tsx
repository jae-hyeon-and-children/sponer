"use client";
import Button from "@/components/global/button";
import Input from "@/components/global/input";
import Image from "next/image";
import Link from "next/link";
import { useFormState } from "react-dom";
import ChangePassword from "./actions";
import Header from "@/components/global/header";
import { useRouter } from "next/navigation";
import useAuth from "@/libs/auth";
import { useEffect, useState } from "react";
import { IResponse } from "@/model/responses";

export default function ChangePasswordPage() {
  const [currentState, dispatch] = useFormState(ChangePassword, null);
  const router = useRouter();
  const user = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

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
      <div className="flex flex-col items-center pt-60 px-4">
        <div className="flex flex-col md:flex-row max-w-screen-2xl w-full">
          <div className="flex flex-col justify-center items-center md:w-1/2">
            <Image
              src="/ggobok222.png"
              alt="Logo"
              width={852}
              height={814}
              className="hidden md:block"
            />
          </div>
          <div className="flex flex-col m-auto items-start w-full md:w-1/2 h-[814px] p-4 md:pl-[100px] gap-2">
            <Image
              src="/sponer_Logo.png"
              alt="Logo"
              width={100}
              height={40}
              className="items-center mt-20"
            />
            <form action={dispatch} className="w-full">
              <div className="text-gray-900 text-[2rem] mt-2 mb-3">
                비밀번호 찾기
              </div>
              <div className="flex flex-col gap-5 mt-14">
                <Input
                  name="email"
                  type="email"
                  placeholder="이메일"
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
