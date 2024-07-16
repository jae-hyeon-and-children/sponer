// import { getUserById } from "./actions";
// import BrandUserForm from "@/components/my-page/user/brand/brand-form";
// import StylistUserForm from "@/components/my-page/user/stylist/stylist-form";

// export default async function EditProfile({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const user = await getUserById(params.id);

//   if (!user) return;

//   console.log(user);

//   return (
//     <>
//       {user.userType === "brand" ? (
//         <BrandUserForm data={user} userId={params.id} />
//       ) : (
//         <StylistUserForm data={user} userId={params.id} />
//       )}
//     </>
//   );
// }

// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import BrandUserForm from "@/components/my-page/user/brand/brand-form";
// import StylistUserForm from "@/components/my-page/user/stylist/stylist-form";
// import { getUserById } from "./actions";
// import { IUser } from "@/model/user";
// import { useRouter } from "next/navigation";
// import UnregisteredUserForm from "@/components/my-page/UnregisteredUserForm";

// export default function EditProfile() {
//   const { data: session, status } = useSession();
//   const [user, setUser] = useState<IUser | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "loading") return; // 세션이 로딩 중인 경우 아무 작업도 하지 않습니다.

//     if (!session) {
//       // 로그인되지 않은 경우 로그인 페이지로 리디렉션합니다.
//       console.log("User not authenticated. Redirecting to login.");
//       router.push("/login");
//       return;
//     }

//     const fetchUser = async () => {
//       if (session.user?.id) {
//         console.log("Fetching user data for user ID:", session.user.id);
//         const fetchedUser = await getUserById(session.user.id);
//         console.log("Fetched user data:", fetchedUser);
//         setUser(fetchedUser);
//       }
//     };

//     fetchUser();
//   }, [session, status, router]);

//   if (status === "loading") {
//     return <div>Loading...</div>; // 로딩 상태를 표시합니다.
//   }

//   if (!user) {
//     return (
//       <div>
//         User data not found or user is not registered. Redirecting to
//         registration page.
//         <UnregisteredUserForm />
//       </div>
//     );
//   }

//   console.log("Rendering form for user:", user);

//   return (
//     <>
//       {user.userType === "brand" ? (
//         <BrandUserForm data={user} userId={session!.user.id} />
//       ) : user.userType === "stylist" ? (
//         <StylistUserForm data={user} userId={session!.user.id} />
//       ) : (
//         <UnregisteredUserForm /> // 등록되지 않은 유저 폼을 렌더링합니다.
//       )}
//     </>
//   );
// }

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getUserById } from "./actions";
import BrandUserForm from "../../../../components/my-page/user/brand/brand-form";
import StylistUserForm from "../../../../components/my-page/user/stylist/stylist-form";
import UnregisteredUserForm from "@/components/my-page/UnregisteredUserForm";

export default function EditProfile({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserById(params.id);
      console.log("Fetched user data:", userData); // 로그 추가
      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, [params.id]);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session?.user?.id !== params.id && session?.user?.userType !== "admin")
    ) {
      router.push("/login");
    }
  }, [status, session, params.id, router]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
    return <div>유저를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      {user.userType === "brand" ? (
        <BrandUserForm data={user} userId={params.id} />
      ) : user.userType === "stylist" ? (
        <StylistUserForm data={user} userId={params.id} />
      ) : (
        <UnregisteredUserForm data={user} userId={params.id} />
      )}
    </>
  );
}
