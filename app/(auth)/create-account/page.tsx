"use client";

import Button from "@/app/components/button";
import Input from "@/app/components/global/input";
import NavBar from "@/app/components/header";
import Image from "next/image";

import { useFormState } from "react-dom";
import createaccount from "./actions";

export default function CreateAccount() {
  const [adsfadsf, dispatch] = useFormState(createaccount, null);

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
                <div className="border bg-primary  text-gray-100 rounded-[40px] w-[400px] h-[50px]  ">
                  <Button text="회원가입" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
