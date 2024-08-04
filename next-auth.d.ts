// import NextAuth, { DefaultSession } from "next-auth";
// import "next-auth/jwt";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       uid: string;
//       userType?: string;
//     } & DefaultSession["user"];
//   }

//   interface User {
//     id: string;
//     uid: string;
//     userType?: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     uid: string;
//     userType?: string;
//   }
// }

import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      uid: string;
      userType?: string;
      email: string;
      name: string;
      profileImage?: string;
      address?: string;
      affiliation?: string;
      phoneNumber?: string;
      createdAt?: Date;
      updatedAt?: Date;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    uid: string;
    userType?: string;
    email: string;
    name: string;
    profileImage?: string;
    address?: string;
    affiliation?: string;
    phoneNumber?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
    userType?: string;
  }
}
