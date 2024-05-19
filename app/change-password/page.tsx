"use client";
import Button from "@/app/components/button";
import Input from "@/app/components/global/input";
import NavBar from "@/app/components/header";
import Image from "next/image";
import Link from "next/link";
import { useFormState } from "react-dom";
import changepassword from "./actions";

export default function ChangePassword() {
  const [sibal, dispatch] = useFormState(changepassword, null);
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
                비밀번호 찾기
              </div>
              <div className="flex flex-col gap-5 mt-5">
                <Input name="email" type="email" placeholder="Email" required />
              </div>
              <div className="flex flex-col justify-center items-center text-center gap-2 mt-14">
                <div className="border bg-primary  text-gray-100 rounded-[40px] w-[400px] h-[50px]  ">
                  <Button text="비밀번호 재설정 메일 받기" />
                </div>
                <Link className="mt-10" href="/login">
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

{
  /* <div>
<NavBar />
<div className="flex justify-around max-w-screen-2xl pt-60">
  <div>
    <Image
      src="/ggobok222.png"
      alt="Logo"
      layout="fixed"
      width={100}
      height={40}
      className="cursor-pointer items-center"
    />
  </div>
  <div className="flex flex-col">
    <Image
      src="/sponer_Logo.png"
      alt="Logo"
      layout="fixed"
      width={100}
      height={40}
      className="cursor-pointer items-center"
    />
    <form action={dispatch}>
      <div>
        <div>비밀번호 찾기</div>
        <Input name="email" type="email" placeholder="Email" required />
        <div className="flex flex-col">
          <Button text="비밀번호 재설정 메일 받기" />
        </div>
        <div className="flex gap-7">
          <Link href="/login">로그인 페이지로 이동하기 &rarr;</Link>
        </div>
      </div>
    </form>
  </div>
</div>
</div> */
}
