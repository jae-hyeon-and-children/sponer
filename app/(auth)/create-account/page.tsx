"use client";

import { useState } from "react";
import Input from "@/components/global/input";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  getIdToken,
} from "firebase/auth";
import { auth } from "@/config/firebase/firebase";

export default function CreateAccountForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    try {
      // 회원가입
      const createUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(createUser.user, { displayName: email });

      // 자동 로그인 시도
      const loginUser = await signInWithEmailAndPassword(auth, email, password);
      const uid = loginUser.user.uid;
      const idToken = await getIdToken(loginUser.user);

      // 서버에 사용자 정보 저장 및 채팅방 생성 요청
      const response = await fetch("/api/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: createUser.user.uid,
          email: createUser.user.email,
          profileImage:
            createUser.user.photoURL || "/path/to/default/profileImage.png",
        }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        // 로그인 후 토큰 발급 요청
        const loginResponse = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid }),
        });

        if (loginResponse.ok) {
          // 페이지 리다이렉트
          router.push("/add-user");
        } else {
          setErrorMessage("로그인 중 문제가 발생했습니다.");
        }
      } else {
        setErrorMessage(result.message || "오류가 발생했습니다");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      setLoading(false);
      setErrorMessage("예상치 못한 에러가 발생했습니다.");
    }
  };

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
