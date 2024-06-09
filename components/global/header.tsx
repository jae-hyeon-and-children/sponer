"use client";

import Image from "next/image";
import Link from "next/link";
import useAuth from "@/libs/auth";
import LogOutButton from "../logout/logoutbutton";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  EnvelopeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const user = useAuth();

  // if (!user) return null;

  return (
    <div className="">
      <nav className="border-b-2 p-1 fixed top-0 left-0 right-0 bg-white z-10">
        <div className="container mx-auto flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/sponer_Logo.png"
                alt="Logo"
                width={100}
                height={40}
                className="cursor-pointer"
              />
            </Link>
            <div>
              <Link href="/add-user">소속정하기</Link>
            </div>
          </div>
          <div className="hidden lg:flex space-x-4 gap-12">
            <Link
              href={`/chats/${user?.uid}`}
              className="text-black hover:text-gray-300"
            >
              Messages
            </Link>
            <Link
              href={`/my-page/${user?.uid}`}
              className="text-black hover:text-gray-300"
            >
              My Page
            </Link>
            {user ? (
              <LogOutButton />
            ) : (
              <Link href="/login" className="text-black hover:text-gray-300">
                로그인
              </Link>
            )}
          </div>
          <div className="flex lg:hidden space-x-4 gap-6 items-center">
            <Link href={`/chats/${user?.uid}`}>
              <EnvelopeIcon className="h-6 w-6 text-black hover:text-gray-300" />
            </Link>
            <Link href={`/my-page/${user?.uid}`}>
              <UserCircleIcon className="h-6 w-6 text-black hover:text-gray-300" />
            </Link>
            {user ? (
              <LogOutButton>
                <ArrowRightOnRectangleIcon className="h-6 w-6 text-black hover:text-gray-300" />
              </LogOutButton>
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
