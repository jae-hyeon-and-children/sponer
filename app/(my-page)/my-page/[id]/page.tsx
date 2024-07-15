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

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BrandUserForm from "@/components/my-page/user/brand/brand-form";
import StylistUserForm from "@/components/my-page/user/stylist/stylist-form";
import { getUserById } from "./actions";
import { IUser } from "@/model/user";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // 세션이 로딩 중인 경우 아무 작업도 하지 않습니다.

    if (!session) {
      // 로그인되지 않은 경우 로그인 페이지로 리디렉션합니다.
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      if (session.user?.id) {
        const fetchedUser = await getUserById(session.user.id);
        setUser(fetchedUser);
      }
    };

    fetchUser();
  }, [session, status, router]);

  if (status === "loading" || !user) {
    return <div>Loading...</div>; // 로딩 상태를 표시합니다.
  }

  console.log(user);

  return (
    <>
      {user.userType === "brand" ? (
        //@ts-ignore
        <BrandUserForm data={user} userId={session.user.id} />
      ) : (
        //@ts-ignore
        <StylistUserForm data={user} userId={session.user.id} />
      )}
    </>
  );
}
