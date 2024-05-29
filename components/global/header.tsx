"use client";

import Image from "next/image";
import Link from "next/link";
import useAuth from "@/libs/auth";
import LogOutButton from "../../app/(login)/logout/logoutbutton";

export default function Header() {
  const user = useAuth();

  return (
    <div className="">
      <nav className="border-b-2 p-1 fixed top-0 left-0 right-0 bg-white z-10">
        <div className="container mx-auto flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/sponer_Logo.png"
                alt="Logo"
                layout="fixed"
                width={100}
                height={40}
                className="cursor-pointer items-center"
              />
            </Link>
          </div>
          <div className="flex space-x-4 gap-12">
            <Link href="/messages" className="text-black hover:text-gray-300">
              Messages
            </Link>
            <Link href="/mypage" className="text-black hover:text-gray-300">
              My Page
            </Link>
            {user ? (
              <LogOutButton />
            ) : (
              <>
                <Link href="/login" className="text-black hover:text-gray-300">
                  로그인
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
