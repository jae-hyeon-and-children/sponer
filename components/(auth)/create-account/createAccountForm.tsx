"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Input from "@/components/global/input";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { signIn } from "next-auth/react";

function CreateAccountFormSkeleton() {
  return (
    <div className="flex flex-col items-center h-screen px-4 animate-pulse">
      <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
        <div className="flex flex-col items-start h-screen-1/2 w-full md:w-[50%] gap-2">
          <div className="w-full">
            <div className="display text-gray-300 text-[2rem] flex justify-center mb-10">
              스포너에 오신 것을 환영합니다
            </div>
            <div className="flex flex-col gap-5 mt-14">
              <div className="w-full bg-gray-200 h-10 rounded"></div>
              <div className="w-full bg-gray-200 h-10 rounded"></div>
            </div>
            <div className="flex flex-col justify-center items-center text-center gap-2 mt-10">
              <div className="border bg-gray-300 text-gray-300 rounded-xl w-full h-14 flex justify-center items-center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateAccountForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!email || !password) {
      setErrorMessage("Email과 Password가 필요합니다.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("비밀번호는 6자리 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    try {
      // 회원가입 시도
      const createUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(createUser.user, { displayName: email });

      // NextAuth를 사용한 자동 로그인 시도
      const loginResponse = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginResponse?.error) {
        setErrorMessage("로그인 중 문제가 발생했습니다.");
        setLoading(false);
        return;
      }

      // 토큰 가져오기
      const token = await createUser.user.getIdToken();

      // 서버에 사용자 정보 저장 및 채팅방 생성 요청
      const response = await fetch("/api/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: createUser.user.uid,
          email: createUser.user.email,
          profileImage:
            createUser.user.photoURL || "/path/to/default/profileImage.png",
          token,
        }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        // 페이지 리다이렉트
        router.push("/add-user");
      } else {
        setErrorMessage(result.message || "오류가 발생했습니다");
      }
    } catch (error: unknown) {
      console.error("회원가입 오류:", error);
      setLoading(false);

      // Firebase 에러 메시지 처리
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("이미 사용 중인 이메일입니다.");
        } else {
          setErrorMessage("예상치 못한 에러가 발생했습니다.");
        }
      } else {
        setErrorMessage("예상치 못한 에러가 발생했습니다.");
      }
    }
  };

  if (status === "loading") {
    return <CreateAccountFormSkeleton />;
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="flex flex-col items-center h-screen px-4">
      <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
        <div className="flex flex-col items-start h-screen-1/2 w-full md:w-[50%] gap-2">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="display text-gray-900 text-[2rem] flex justify-center">
              스포너에 오신 것을 환영합니다
            </div>
            <div className="flex flex-col gap-5 mt-14">
              <Input name="email" type="email" placeholder="이메일" required />
              <Input
                name="password"
                type="password"
                placeholder="비밀번호"
                required
              />
              {errorMessage && (
                <div className="text-state-red text-center mt-2">
                  {errorMessage}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center items-center text-center gap-2 mt-10">
              <button
                className="border bg-primary text-gray-100 rounded-xl w-full h-14 flex justify-center items-center"
                type="submit"
                disabled={loading}
              >
                <span className="label-1 text-gray-100">회원가입</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
