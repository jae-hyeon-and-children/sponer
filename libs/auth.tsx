import { useState, useEffect } from "react";
import { auth } from "@/config/firebase/firebase";
import { User } from "firebase/auth";

const useAuth = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 이 효과가 실행되도록 함

  return user;
};

export default useAuth;
