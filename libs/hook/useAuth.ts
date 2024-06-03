import { useState, useEffect } from "react";
import { auth } from "@/config/firebase/firebase";
import { User } from "firebase/auth";

const useAuth = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    currentUser ? setUser(currentUser) : setUser(null);
  });

  return user;
};

export default useAuth;
