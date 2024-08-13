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
// import BrandUserForm from "../../../../components/my-page/user/brand/brand-form";

export default function EditProfile({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserById(params.id);
      setUser(userData);
      setLoading(false);

      if (!userData) {
        router.push("/add-user");
      }
    };

    fetchUser();
  }, [params.id]);

  useEffect(() => {
    console.log(session?.user?.userType);
    if (
      status === "unauthenticated" ||
      (session?.user?.id !== params.id && session?.user?.userType !== "admin")
    ) {
      console.log("go to add-user");
      router.push("/add-user");
    }
  }, [status, session, params.id, router]);

  if (loading) {
    return <Skeleton />;
  }
  if (!user) {
    return <div>유저를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      {user.userType === "brand" ? (
        <BrandUserForm data={user} userId={params.id} />
      ) : (
        <StylistUserForm data={user} userId={params.id} />
      )}
    </>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse p-4">
      <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
      <div className="h-48 bg-gray-200 rounded mt-4"></div>
    </div>
  );
}
