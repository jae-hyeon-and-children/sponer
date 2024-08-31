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
      if (status === "loading") {
        return;
      }

      if (
        status === "unauthenticated" ||
        (session?.user?.id !== params.id && session?.user?.userType !== "admin")
      ) {
        console.log("go to add-user");
        router.push("/add-user");
        return;
      }

      const userData = await getUserById(params.id);
      setUser(userData);
      setLoading(false);

      if (!userData) {
        router.push("/add-user");
      }
    };

    fetchUser();
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
    <div className="animate-pulse p-4 flex flex-col gap-6 mt-32">
      <div className="flex gap-8">
        {/* 사이드바 */}
        <div className="w-1/5 flex flex-col gap-4">
          {Array.from({ length: 13 }).map((_, index) => (
            <div key={index} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {/* 프로필 사진 */}
          <div className="flex justify-center mb-8">
            <div className="h-32 w-32 bg-gray-200 rounded-full"></div>
          </div>

          {/* 프로필 수정 제목 */}
          <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 w-full">
              {/* 프로필 정보 입력란 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>

              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 bg-gray-200 rounded w-full"
                ></div>
              ))}
              <div className="h-52 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
