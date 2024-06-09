import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { IResponse } from "@/model/responses";

import { IUser } from "@/model/user";
import { createChatRoom } from "@/libs/api/chat-room";
import { Timestamp } from "firebase/firestore";

export default async function createAccount(
  prevState: any,
  formData: FormData
): Promise<IResponse> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return {
      status: 400,
      success: false,
      message: "Email and password are required",
    };
  }

  try {
    // 회원가입 처리
    const createUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(createUser.user, {});

    // 어드민 정보 설정
    const admin: IUser = {
      id: "sponer@gmail.com",
      name: "",
      profileImage: "/path/to/admin/profileImage.png",
      email: "admin@example.com",
      address: "Admin Address",
      phoneNumber: "010-0000-0000",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userType: "admin",
    };

    // 새로 생성된 사용자 정보 설정
    const newUser: IUser = {
      id: createUser.user.uid,
      name: createUser.user.displayName || email,
      profileImage:
        createUser.user.photoURL || "/path/to/default/profileImage.png",
      email: email,
      address: "",
      phoneNumber: "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userType: "",
    };

    // 채팅방 생성 호출
    const chatRoomResponse = await createChatRoom(admin, newUser, "");

    if (!chatRoomResponse.success) {
      return {
        status: 500,
        success: false,
        message: `Error while creating chatroom: ${chatRoomResponse.message}`,
      };
    }

    return {
      status: 200,
      success: true,
      message: "성공적으로 회원가입 되셨습니다.",
    };
  } catch (e) {
    if (e instanceof FirebaseError) {
      return {
        status: 500,
        success: false,
        message:
          "올바른 형식이 아닙니다. 비밀번호는 최소 6자 이상이어야 합니다.",
      };
    }
    return {
      status: 500,
      success: false,
      message: "예상치 못한 에러가 발생했습니다.",
    };
  }
}
