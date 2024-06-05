import { useState, useEffect } from "react";
import { auth } from "@/config/firebase/firebase";
import { User } from "firebase/auth";

const useAuth = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("현재 로그인 유저 정보 : ", currentUser);
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);
  console.log("인증상태 ", auth); // 의존성 배열을 [auth]로 수정

  return user;
};

export default useAuth;
