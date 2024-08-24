"use server";

import { IUser } from "@/model/user";
import {
  Timestamp,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { adminAuth } from "@/config/firebase/firebaseadmin";
import { fireStore } from "@/config/firebase/firebase";
import { createChatRoom } from "@/libs/api/chat-room";

export async function createAccountHandler(
  userId: string,
  email: string,
  name: string,
  profileImage: string,
  token: string
): Promise<{ status: number; success: boolean; message: string }> {
  try {
    console.log("Received Token:", token);
    console.log("Received userId:", userId);
    console.log("Received email:", email);
    if (!userId || !email || !token) {
      return {
        status: 400,
        success: false,
        message: "User ID와 Email, 토큰이 필요합니다.",
      };
    }

    // Firebase에서 발급한 토큰 검증
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (decodedToken.uid !== userId) {
      throw new Error("유효하지 않은 토큰");
    }

    // Firestore에서 사용자 문서 확인
    const userDocRef = doc(fireStore, "User", userId);
    const userDocSnap = await getDoc(userDocRef);

    // 어드민 정보 설정
    const adminUser: IUser = {
      id: "8bwWPTjfDraAphQZTNBWA95bZpA3",
      name: "스포너 관리자",
      profileImage: "/sponer_Logo.png",
      email: "sponer.company@gmail.com",
      address: " 서울특별시 용산구 한강대로92길 15, 1층(갈월동)",
      phoneNumber: " 010-4331-7797",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userType: "admin",
    };

    if (!userDocSnap.exists()) {
      // 새로 생성된 사용자 정보 설정
      const newUser: IUser = {
        id: userId,
        name: name,
        profileImage: profileImage,
        email: email,
        address: "",
        phoneNumber: "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        userType: "",
      };

      console.log("Creating chat room with admin and newUser");
      // 채팅방 생성 호출
      const chatRoomResponse = await createChatRoom(adminUser, newUser, "");

      if (!chatRoomResponse.success) {
        console.log("Chat room creation failed:", chatRoomResponse.message);
        return {
          status: 500,
          success: false,
          message: `Error while creating chatroom: ${chatRoomResponse.message}`,
        };
      }

      console.log("Chat room created successfully");

      // Firestore에 사용자 문서 생성
      await setDoc(userDocRef, newUser);
      return {
        status: 200,
        success: true,
        message: "성공적으로 회원가입 되셨습니다.",
      };
    } else {
      console.log("User already exists in Firestore");
    }

    return {
      status: 200,
      success: true,
      message: "로그인 성공",
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 500,
      success: false,
      message: "예상치 못한 에러가 발생했습니다.",
    };
  }
}
