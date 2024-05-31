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
import { useEffect } from "react";

export default function ChangePasswordPage() {
  const [_, dispatch] = useFormState(ChangePassword, null);
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
              <div className="display text-gray-900 text-[30px] mt-2 mb-2">
                비밀번호 찾기
              </div>
              <div className="flex flex-col gap-5 mt-14">
                <Input
                  name="email"
                  type="email"
                  placeholder="이메일"
                  required
                />
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
