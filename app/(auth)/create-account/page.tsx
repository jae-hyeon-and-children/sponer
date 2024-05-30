"use client";

import Image from "next/image";
import { useFormState } from "react-dom";
import createaccount from "./actions";
import Input from "@/components/global/input";

import Header from "@/components/global/header";
import { useRouter } from "next/navigation";
import useAuth from "@/libs/auth";
import { useEffect } from "react";

export default function CreateAccount() {
  const [_, dispatch] = useFormState(createaccount, null);
  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

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
              <div className="font-medium text-[30px] mt-2 mb-2">
                스포너에 오신 것을 환영합니다
              </div>
              <div className="flex flex-col gap-5 mt-5">
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
              <div className="flex flex-col justify-center items-center text-center gap-2 mt-14">
                <button className="border bg-primary text-gray-100 rounded-[40px] w-[400px] h-[50px] flex justify-center items-center">
                  <span>회원가입</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
