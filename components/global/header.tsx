"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  EnvelopeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const { data: session, status } = useSession();
  console.log("헤더 - 세션 상태:", status);
  console.log("헤더 - 세션 데이터:", session);

  return (
    <div className="">
      <nav className="shadow-md shadow-[#00000029] p-1 fixed top-0 left-0 right-0 bg-white z-10">
        <div className="container mx-auto flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/sponer_Logo.png"
                alt="Logo"
                width={69}
                height={50}
                className="cursor-pointer"
              />
            </Link>
            <div className="ml-4">
              <Link href="/add-user">소속정하기</Link>
            </div>
          </div>

          <div className="hidden lg:flex space-x-4 gap-12">
            <Link
              href={`/chats/${session?.user?.id}`}
              className="text-black hover:text-gray-300"
            >
              Messages
            </Link>
            <Link
              href={`/my-page/${session?.user?.id}`}
              className="text-black hover:text-gray-300"
            >
              My Page
            </Link>
            {status === "authenticated" ? (
              <button
                onClick={() => signOut()}
                className="text-black hover:text-gray-300"
              >
                로그아웃
              </button>
            ) : (
              <Link href="/login" className="text-black hover:text-gray-300">
                로그인
              </Link>
            )}
          </div>
          <div className="flex lg:hidden space-x-4 gap-6 items-center">
            <Link href={`/chats/${session?.user?.id}`}>
              <EnvelopeIcon className="h-6 w-6 text-black hover:text-gray-300" />
            </Link>
            <Link href={`/my-page/${session?.user?.id}`}>
              <UserCircleIcon className="h-6 w-6 text-black hover:text-gray-300" />
            </Link>
            {status === "authenticated" ? (
              <button onClick={() => signOut()} aria-label="로그아웃">
                <ArrowRightOnRectangleIcon className="h-6 w-6 text-black hover:text-gray-300" />
              </button>
            ) : (
              <Link href="/login">
                <ArrowLeftOnRectangleIcon className="h-6 w-6 text-black hover:text-gray-300" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
