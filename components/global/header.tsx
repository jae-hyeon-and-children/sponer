"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  EnvelopeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { doc, getDoc } from "firebase/firestore";
import { fireStore } from "@/config/firebase/firebase";

function HeaderSkeleton() {
  return (
    <header className="">
      <nav className="shadow-md shadow-[#00000029] p-1 fixed top-0 left-0 right-0 bg-white z-10">
        <div className="container mx-auto flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-lg w-16 h-10"></div>
          </div>
          <div className="hidden lg:flex space-x-4 gap-12">
            <div className="bg-gray-200 rounded-lg w-24 h-6"></div>
            <div className="bg-gray-200 rounded-lg w-24 h-6"></div>
            <div className="bg-gray-200 rounded-lg w-24 h-6"></div>
          </div>
          <div className="flex lg:hidden space-x-4 gap-6 items-center">
            <div className="bg-gray-200 rounded-full w-6 h-6"></div>
            <div className="bg-gray-200 rounded-full w-6 h-6"></div>
            <div className="bg-gray-200 rounded-full w-6 h-6"></div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function Header() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserType = async () => {
      if (session?.user?.id) {
        const userDoc = await getDoc(doc(fireStore, "User", session.user.id));
        const userType = userDoc.data()?.userType;
        setIsAdmin(userType === "admin");
        console.log("Fetched userType:", userType);
      }
    };

    fetchUserType();
  }, [session]);

  console.log("헤더 - 세션 상태:", status);
  console.log("헤더 - 세션 데이터:", session);
  console.log("헤더 - isAdmin 값:", isAdmin);

  if (status === "loading") {
    return <HeaderSkeleton />;
  }

  return (
    <header className="">
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
          </div>

          {status === "authenticated" ? (
            <div className="hidden lg:flex space-x-4 gap-12">
              {isAdmin && (
                <Link href="/admin" className="text-black hover:text-gray-300">
                  어드민 페이지
                </Link>
              )}
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
              <button
                onClick={() => signOut()}
                className="text-black hover:text-gray-300"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex space-x-4 gap-12">
              <Link href="/login" className="text-black hover:text-gray-300">
                로그인
              </Link>
            </div>
          )}

          <div className="flex lg:hidden space-x-4 gap-6 items-center">
            {status === "authenticated" ? (
              <>
                <Link href={`/chats/${session?.user?.id}`}>
                  <EnvelopeIcon className="h-6 w-6 text-black hover:text-gray-300" />
                </Link>
                <Link href={`/my-page/${session?.user?.id}`}>
                  <UserCircleIcon className="h-6 w-6 text-black hover:text-gray-300" />
                </Link>
                <button onClick={() => signOut()} aria-label="로그아웃">
                  <ArrowRightOnRectangleIcon className="h-6 w-6 text-black hover:text-gray-300" />
                </button>
              </>
            ) : (
              <Link href="/login">
                <ArrowLeftOnRectangleIcon className="h-6 w-6 text-black hover:text-gray-300" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
