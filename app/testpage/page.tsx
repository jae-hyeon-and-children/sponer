import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { adminAuth } from "@/config/firebase/firebaseadmin";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function TestPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  console.log("SSR 쿠키:", cookieStore);
  console.log("SSR 토큰:", token);

  if (!token) {
    redirect("/login");
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const uid = payload.uid as string;
    const userRecord = await adminAuth.getUser(uid);
    const user = { name: userRecord.displayName || "Unknown User" };

    console.log("ssr uid : ", uid);
    console.log("ssr user : ", user);
    console.log("JWT 검증 성공, UID:", uid);

    return (
      <div>
        <h1>Test Page</h1>
        <h1>Test Page</h1>
        <h1>Test Page</h1>
        <h1>Test Page</h1>
        <h1>Test Page</h1>
        <h1>Test Page</h1>
        <h1>Test Page</h1>
        <p>Welcome, {user.name}</p>
      </div>
    );
  } catch (error) {
    console.error("JWT 검증 오류:", error);
    redirect("/login");
    return null;
  }
}
