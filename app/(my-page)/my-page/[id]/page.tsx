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
