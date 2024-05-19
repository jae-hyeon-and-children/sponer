"use client";

import Image from "next/image";
import NavBar from "../components/header";
import Input from "../components/global/input";
import Button from "../components/button";
import Link from "next/link";
import { useFormState } from "react-dom";
import login from "./actions";
import GoogleLoginButton from "../google/start/route";

export default function Login() {
  const [sibal, dispatch] = useFormState(login, null);

  return (
    <>
      <NavBar />
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
                <Input name="email" type="email" placeholder="Email" required />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="flex flex-col justify-center items-center text-center gap-2 mt-14">
                <div className="border bg-primary text-gray-100 rounded-[40px] w-[400px] h-[50px]">
                  <Button text="로그인" />
                </div>
                <div className="border bg-primary text-gray-100 rounded-[40px] w-[400px] h-[50px]">
                  {/* <GoogleLoginButton /> */}
                </div>
                <div className="flex gap-3">
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
