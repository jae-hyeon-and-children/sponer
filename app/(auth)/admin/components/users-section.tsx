"use client";

import { fireStore } from "@/config/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

// 유저 타입
type User = {
  name: string;
  email: string;
  uid: string;
  userType: string;
  phoneNumber?: string;
  brandName?: string;
  nickName?: string;
  address?: string;
};

// 모든 유저를 가지고 오는 함수
async function fetchAllUsers(): Promise<User[]> {
  const usersCollection = collection(fireStore, "User");
  const usersSnapshot = await getDocs(usersCollection);
  const usersList = usersSnapshot.docs.map((doc) => {
    const data = doc.data() as User;
    return {
      ...data,
      uid: doc.id, // 문서의 ID를 uid로 사용
      phoneNumber: data.phoneNumber || "없음", // phoneNumber 필드 추가
      brandName: data.userType === "brand" ? data.brandName : undefined,
      nickName: data.userType === "stylist" ? data.nickName : undefined,
      address: data.address || "없음",
    };
  });
  return usersList;
}

export default function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers: User[] = await fetchAllUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    };

    getUsers();
  }, []);

  if (loading) {
    return <div className="text-center">사용자 목록을 불러오는 중...</div>;
  }

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">사용자 목록</h2>
      <ul className="space-y-4">
        {users.map((user, index) => (
          <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
            {user.userType === "brand" && (
              <p>
                <strong>브랜드명:</strong> {user.brandName || "없음"}
              </p>
            )}
            {user.userType === "stylist" && (
              <>
                <p>
                  <strong>닉네임:</strong> {user.nickName || "없음"}
                </p>
              </>
            )}
            <p>
              <strong>UID:</strong> {user.uid || "없음"}
            </p>
            <p>
              <strong>유저 타입:</strong> {user.userType || "없음"}
            </p>
            <p>
              <strong>이메일:</strong> {user.email || "없음"}
            </p>
            <p>
              <strong>이름:</strong> {user.name || "없음"}
            </p>
            <p>
              <strong>전화번호:</strong> {user.phoneNumber || "없음"}
            </p>
            <p>
              <strong>주소:</strong> {user.address || "없음"}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
