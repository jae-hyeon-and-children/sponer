// libs/auth.ts

import { NextApiResponse } from "next";
import { serialize } from "cookie";
import { UserRecord } from "firebase-admin/auth";
import { auth } from "firebase-admin";

export async function setLoginSession(res: NextApiResponse, user: UserRecord) {
  const token = await auth().createCustomToken(user.uid);

  const cookie = serialize("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "strict",
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}
