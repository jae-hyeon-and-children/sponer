"use client";

import Link from "next/link";

import NavBar from "../components/header";

import Input from "@/components/global/input";
import { auth } from "@/config/firebase/firebase";

export default function Home() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          phtoURL: user.photoURL,
        })
      );
    }
  });
  return (
    <main>
      <NavBar />
      <div className="flex justify-between max-w-screen-2xl pt-44">
        <Link href="/login">로그인</Link>
      </div>
      <div>
        <Link href="/create-account">회원가입</Link>
      </div>
      <div>
        <Link href="/change-password">비번찾기</Link>
      </div>
      <div>
        <Link href="/add-user">소속정하기</Link>
      </div>
      <div>
        <Input name="name" type="text" count={10} />

        <h1 className="display">Display</h1>
        <h1 className="heading-1">Heading 1</h1>
        <h2 className="heading-2">Heading 2</h2>
        <h3 className="heading-3">Heading 3</h3>
        <p className="paragraph-1">paragraph 1</p>
        <p className="paragraph-2">paragraph 2</p>

        <p className="label-1">label 1</p>
        <p className="label-2">label 2</p>
        <p className="label-3">label 3</p>

        <span className="caption">caption</span>
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-gray-50">
        gray-50
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-gray-100">
        gray-100
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-gray-200">
        gray-200
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-gray-300">
        gray-300
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-gray-400">
        gray-400
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-gray-500">
        gray-500
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-gray-600">
        gray-600
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-gray-700">
        gray-700
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-gray-800">
        gray-800
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-gray-900">
        gray-900
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-state-green">
        state-green
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-state-red">
        state-red
      </div>
      <div className="w-40 h-20 flex items-center justify-center bg-primary">
        primary
      </div>
    </main>
  );
}
