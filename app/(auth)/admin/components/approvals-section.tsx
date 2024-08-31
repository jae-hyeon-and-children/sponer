"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IUser } from "@/model/user";
import {
  approveBrand,
  getPendingBrandUsers,
  rejectBrand,
} from "@/app/(my-page)/my-page/[id]/actions";
import Image from "next/image";
import EmptyView from "@/components/global/empty-view";

export default function ApprovalsSection() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const pendingUsers = await getPendingBrandUsers();
      setUsers(pendingUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleApprove = async (userId: string, historyId: string) => {
    console.log(
      `Approve button clicked for user ID: ${userId}, History ID: ${historyId}`
    );
    try {
      // 특정 History ID만 승인
      await approveBrand(userId, historyId);

      // 승인 후 해당 히스토리를 리스트에서 제거
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                history: user.history?.filter(
                  (historyItem) => historyItem.historyId !== historyId
                ),
              }
            : user
        )
      );
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleReject = async (userId: string, historyId: string) => {
    console.log(
      `Reject button clicked for user ID: ${userId}, History ID: ${historyId}`
    );
    const reason = prompt("거절 사유를 입력해주세요:");
    if (!userId || !historyId) {
      console.error(
        "Invalid userId or historyId, cannot proceed with rejection"
      );
      return;
    }
    if (reason) {
      try {
        await rejectBrand(userId, historyId, reason);
        // 거절 후 해당 히스토리를 리스트에서 제거
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  history: user.history?.filter(
                    (historyItem) => historyItem.historyId !== historyId
                  ),
                }
              : user
          )
        );
      } catch (error) {
        console.error("Error rejecting user:", error);
      }
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (users.length === 0) {
    return <EmptyView text="승인 대기 중인 사용자가 없습니다." />;
  }

  return (
    <section className="bg-white rounded-lg shadow p-6 w-full max-w-screen-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">사용자 승인</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex flex-col gap-4 mb-4 border-b pb-4">
            <div className="flex items-center">
              <Image
                src={user.profileImage || "/default-profile.png"}
                width={50}
                height={50}
                alt={"사용자 프로필"}
                className="w-12 h-12 object-cover rounded-full mr-4"
              />
              <Link href={`/my-page/${user.id}`} className="text-blue-500">
                {user.brandName}
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {user.history?.map((historyItem) => (
                <div
                  key={historyItem.historyId}
                  className="flex gap-2 items-center"
                >
                  <p className="text-sm text-gray-600">
                    <strong>신청 브랜드 이름:</strong> {historyItem.brandName}
                  </p>
                  <button
                    onClick={() =>
                      handleApprove(user.id!, historyItem.historyId)
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    승인
                  </button>
                  <button
                    onClick={() =>
                      handleReject(user.id!, historyItem.historyId)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    거절
                  </button>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
