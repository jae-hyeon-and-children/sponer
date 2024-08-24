"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Input from "@/components/global/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "./google-login";
import { doc, getDoc } from "firebase/firestore";
import { fireStore } from "@/config/firebase/firebase";

function LoginPageSkeleton() {
  return (
    <div className="flex flex-col items-center h-screen px-5 animate-pulse">
      <main className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
        <section className="flex flex-col items-start w-full md:w-[50%] gap-2">
          <div className="w-full">
            <h1 className="display text-gray-300 text-[2rem] flex justify-center mb-10">
              로그인
            </h1>
            <div className="flex flex-col gap-3 mt-14">
              <div className="w-full bg-gray-200 h-10 rounded"></div>
              <div className="w-full bg-gray-200 h-10 rounded"></div>
              <div className="flex flex-col items-end my-1 mr-3">
                <div className="label-2 text-gray-300 w-24 h-6 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center gap-2 mt-2">
              <div className="border bg-gray-300 text-gray-300 rounded-xl w-full h-12 flex justify-center items-center"></div>
              <div className="border bg-gray-300 text-gray-300 rounded-xl w-full h-12 flex justify-center items-center mt-2"></div>
            </div>
            <div className="flex justify-center mt-6 mr-3">
              <div className="label-2 text-gray-300 w-32 h-6 rounded"></div>
              <div className="label-2 text-gray-300 w-24 h-6 rounded ml-3"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function LoginPageComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkUserType = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          // Firestore에서 userType 확인
          const userDoc = await getDoc(doc(fireStore, "User", session.user.id));

          if (!userDoc.exists()) {
            setErrorMessage("사용자 정보를 찾을 수 없습니다.");
            return;
          }

          const userType = userDoc.data()?.userType;

          // userType이 없으면 add-user 페이지로 리다이렉트
          if (!userType) {
            router.push("/add-user");
          } else {
            // userType이 있으면 메인 페이지로 이동
            router.push("/");
          }
        } catch (error) {
          console.error("사용자 유형 확인 중 오류 발생:", error);
          setErrorMessage("사용자 정보를 확인하는 중 오류가 발생했습니다.");
        }
      }
    };

    checkUserType();
  }, [status, session, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error("로그인 요청 오류:", error);
      setErrorMessage("로그인 중 오류가 발생했습니다.");
    }
  };

  if (status === "loading") {
    return <LoginPageSkeleton />;
  }

  return (
    <div className="flex flex-col items-center h-screen px-5">
      <main className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
        <section className="flex flex-col items-start w-full md:w-[50%] gap-2">
          <form onSubmit={handleSubmit} method="POST" className="w-full">
            <h1 className="display text-gray-900 text-[2rem] flex justify-center">
              로그인
            </h1>
            <div className="flex flex-col gap-3 mt-14">
              <Input name="email" type="email" placeholder="이메일" required />
              <Input
                name="password"
                type="password"
                placeholder="비밀번호"
                required
              />
              <div className="flex flex-col items-end my-1 mr-3">
                <Link href="/change-password" className="label-2 text-gray-600">
                  비밀번호 찾기
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center gap-2 mt-2">
              <button className="box-border border bg-primary text-gray-100 rounded-xl w-full h-12 flex justify-center items-center">
                <span className="label-1 text-gray-100">로그인</span>
              </button>
              {errorMessage && (
                <div className="text-red-500 text-center mt-2">
                  {errorMessage}
                </div>
              )}
              <div className="border-[#C6D0DC] text-gray-600 rounded-xl w-full h-12 flex justify-center items-center mt-2">
                <GoogleLoginButton />
              </div>
            </div>
            <div className="flex justify-center mt-6 mr-3">
              <div className="label-2 text-gray-600 ">
                스포너가 처음이신가요?
              </div>
              <Link
                href="/create-account"
                className="label-2 text-gray-600 border-b-2 border-b[#81878E] ml-3"
              >
                간편 가입하기
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
