import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { getUserById } from "./app/(my-page)/my-page/[id]/actions";
import { createAccountHandler } from "./app/(auth)/create-account/actions";

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
          const userInfo = await getUserById(user.uid);
          console.log("Firebase 로그인 성공:", user);

          const resultUser: User = {
            id: user.uid,
            uid: user.uid,
            email: user.email!,
            name: user.displayName || "",
            image: user.photoURL || "",
            userType: userInfo!.userType || "", // userType 추가
          };
          return resultUser;
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const credential = GoogleAuthProvider.credential(account.id_token);
        const userCredential = await signInWithCredential(auth, credential);

        user.id = userCredential.user.uid;
        const userInfo = await getUserById(user.id);
        user.userType = userInfo!.userType;
        console.log("user id : ", user.id);

        // 소셜 로그인 시 채팅방 생성 로직 추가
        const token = await userCredential.user.getIdToken();
        await createAccountHandler(
          user.id,
          user.email!,
          user.name!,
          userCredential.user.photoURL || "",
          token
        );
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.userType = user.userType;
        console.log("token.uid : ", token.uid);
        console.log("token.userType : ", token.userType);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.uid) {
        session.user.id = token.uid;
        session.user.uid = token.uid;
        session.user.userType = token.userType;
        console.log("session.user.id : ", session.user.id);
        console.log("session.user.userType : ", session.user.userType);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
