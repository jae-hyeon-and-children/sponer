import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
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

          const resultUser: User = {
            id: user.uid,
            uid: user.uid,
            email: user.email!,
            name: user.displayName || "",
            image: user.photoURL || "",
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

        user.id = userCredential.user.uid; // Assign Firebase uid to user id
        console.log("user id : ", user.id);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id; // Use Firebase uid
        console.log("token.uid : ", token.uid);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.uid) {
        session.user.id = token.uid;
        session.user.uid = token.uid;
        console.log("session.user.id : ", session.user.id);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;

// import NextAuth, { NextAuthOptions, User } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import {
//   signInWithEmailAndPassword,
//   signInWithCredential,
//   GoogleAuthProvider,
// } from "firebase/auth";

// import { adminFirestore } from "@/config/firebase/firebaseadmin";
// import { auth } from "@/config/firebase/firebase";

// const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         const { email, password } = credentials as {
//           email: string;
//           password: string;
//         };
//         try {
//           const userCredential = await signInWithEmailAndPassword(auth, email, password);
//           const user = userCredential.user;
//           console.log("Firebase 로그인 성공:", user);

//           const resultUser: User = {
//             id: user.uid,
//             uid: user.uid,
//             email: user.email!,
//             name: user.displayName || "",
//             image: user.photoURL || "",
//           };
//           return resultUser;
//         } catch (error) {
//           console.error("Firebase 로그인 오류:", error);
//           throw new Error("이메일 혹은 비밀번호를 다시 확인해주세요");
//         }
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider === "google") {
//         const credential = GoogleAuthProvider.credential(account.id_token);
//         const userCredential = await signInWithCredential(auth, credential);

//         user.id = userCredential.user.uid; // Assign Firebase uid to user id
//         console.log("user id : ", user.id);
//       }
//       return true;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.uid = user.id; // Use Firebase uid
//         console.log("token.uid : ", token.uid);
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token.uid) {
//         session.user.id = token.uid;
//         session.user.uid = token.uid;
//         console.log("session.user.id : ", session.user.id);
//       }
//       return session;
//     },
//   },
//   adapter: CustomFirestoreAdapter(adminFirestore),
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default authOptions;
