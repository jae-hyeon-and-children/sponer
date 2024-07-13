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
  }, []);

  return user;
};

export default useAuth;

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { auth } from "@/config/firebase/firebase";
// import { User } from "firebase/auth";

// const useAuth = (): User | null => {
//   const { data: session, status } = useSession();
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     if (status === "authenticated" && session) {
//       const currentUser = auth.currentUser;
//       setUser(currentUser);
//     } else {
//       setUser(null);
//     }
//   }, [session, status]);

//   return user;
// };

// export default useAuth;
