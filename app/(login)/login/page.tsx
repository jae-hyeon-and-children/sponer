"use client";

import Image from "next/image";
import Link from "next/link";
import Input from "@/components/global/input";
import GoogleLoginButton from "./googleLogin";
import { useFormState } from "react-dom";
import login from "./actions";
import Header from "../../../components/global/header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@/libs/auth";

export default function Login() {
  const router = useRouter();
  const [_, dispatch] = useFormState(login, null);
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
            className=" items-center mt-20"
          />
          <form action={dispatch}>
            <div>
              <div className="font-medium text-[30px] mt-2 mb-2">
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
              <div className="flex flex-col justify-center items-center text-center gap-2 mt-12">
                <div className="flex flex-col justify-center items-center text-center gap-2 mt-10">
                  <button className="border bg-primary text-gray-100 rounded-[40px] w-[400px] h-[50px] flex justify-center items-center">
                    <span>로그인</span>
                  </button>
                  <div className="border text-gray-700 rounded-[40px] w-[400px] h-[50px] flex justify-center items-center mt-2">
                    <GoogleLoginButton />
                  </div>
                </div>
                <div className="flex gap-3 mt-10 font-light">
                  <Link href="/create-account">회원가입</Link>
                  <div>/</div>
                  <Link href="/change-password">비번찾기</Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
