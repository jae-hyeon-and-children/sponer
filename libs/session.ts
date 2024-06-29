"use server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: string;
}

export default async function getSession() {
  return await getIronSession<SessionContent>(cookies(), {
    cookieName: "sponer",
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
