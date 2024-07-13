import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { adminFirestore } from "@/config/firebase/firebaseadmin";
import { auth } from "@/config/firebase/firebase";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          console.log("Firebase 로그인 성공:", user);

          // Firestore에서 userType 가져오기
          const userDoc = await adminFirestore
            .collection("User")
            .doc(user.uid)
            .get();
          const userType = userDoc.exists ? userDoc.data()?.userType : null;

          return { id: user.uid, email: user.email, userType };
        } catch (error) {
          console.error("Firebase 로그인 오류:", error);
          throw new Error("이메일 혹은 비밀번호를 다시 확인해주세요");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.userType = user.userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.uid) {
        session.user.id = token.uid;
        session.user.userType = token.userType;
      }
      return session;
    },
  },
  adapter: FirestoreAdapter(adminFirestore),
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
