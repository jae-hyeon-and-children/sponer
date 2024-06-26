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
      <div className="flex flex-col items-center h-screen px-4 ">
        <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
          <div className="flex flex-col items-start w-full md:w-[50%] gap-2">
            <form action={dispatch} className="w-full">
              <div className="text-gray-900 text-[2rem] flex justify-center ">
                비밀번호 찾기
              </div>
              <div className="flex flex-col gap-5 mt-10">
                <Input
                  name="email"
                  type="email"
                  placeholder="이메일"
                  required
                />
                {errorMessage && (
                  <div className="text-state-red text-center mt-2">
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
