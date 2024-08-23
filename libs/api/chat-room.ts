"use server";

import { fireStore } from "@/config/firebase/firebase";
import {
  COLLECTION_NAME_CHAT,
  COLLECTION_NAME_MESSAGE,
  ContentType,
} from "@/constants/variables";
import { IChatRoom } from "@/model/chat-room";
import { IMessage, MessageConverter } from "@/model/message";

import { IProduct, ProductConverter } from "@/model/product";
import { IResponse } from "@/model/responses";
import { IUser } from "@/model/user";
import { randomUUID } from "crypto";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function fetchChatRooms() {}

export async function fetchChatRoom() {}

// export async function createChatRoom(
//   brand: IUser,
//   stylelist: IUser,
//   productId: string
// ): Promise<IResponse<string>> {
//   const data: IChatRoom = {
//     users: [
//       {
//         id: brand.id!,
//         name: brand.brandName!,
//         profileImage: brand.profileImage,
//       },
//       {
//         id: stylelist.id!,
//         name: stylelist.nickName ?? stylelist.name,
//         profileImage: stylelist.profileImage,
//       },
//     ],
//     userIds: [brand.id!, stylelist.id!],
//     lastMessage: "아직 메세지가 없습니다",
//     updatedAt: Timestamp.now(),
//     createdAt: Timestamp.now(),
//     productId,
//   };

//   try {
//     console.log("Creating chat room with data:", data);

//     const chatroomId = randomUUID();
//     await setDoc(doc(fireStore, COLLECTION_NAME_CHAT, chatroomId), data);

//     console.log("Chat room created with ID:", chatroomId);

//     return { status: 200, success: true, data: chatroomId };
//   } catch (error) {
//     console.error("Error while creating chatroom:", error);
//     return {
//       status: 400,
//       success: false,
//       message: `Error white creating chatroom: ${error}`,
//     };
//   }
// }

export async function createChatRoom(
  brand: IUser,
  stylelist: IUser,
  productId: string
): Promise<IResponse<string>> {
  const brandName = brand.brandName || brand.email || "Unknown Brand";
  const stylelistName = stylelist.nickName || stylelist.email || "Unknown User";

  const brandProfileImage =
    brand.profileImage || "/default/path/to/profile.png";
  const stylelistProfileImage =
    stylelist.profileImage || "/default/path/to/profile.png";

  const data: IChatRoom = {
    users: [
      {
        id: brand.id!,
        name: brandName,
        profileImage: brandProfileImage,
      },
      {
        id: stylelist.id!,
        name: stylelistName,
        profileImage: stylelistProfileImage,
      },
    ],
    userIds: [brand.id!, stylelist.id!],
    lastMessage: "아직 메세지가 없습니다",
    updatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    productId: productId || "",
  };

  try {
    console.log("Creating chat room with data:", data);

    const chatroomId = randomUUID();
    await setDoc(doc(fireStore, COLLECTION_NAME_CHAT, chatroomId), data);

    console.log("Chat room created with ID:", chatroomId);

    return { status: 200, success: true, data: chatroomId };
  } catch (error) {
    console.error("Error while creating chatroom:", error);
    return {
      status: 400,
      success: false,
      message: `Error while creating chatroom: ${error}`,
    };
  }
}

export async function createChatRoomWithAdmin(
  user: IUser
): Promise<IResponse<string>> {
  const adminUser: IUser = {
    id: "8bwWPTjfDraAphQZTNBWA95bZpA3",
    name: "스포너 관리자",
    nickName: "스포너 관리자",
    brandName: "스포너",
    profileImage: "/sponer_Logo.png",
    email: "",
    address: "서울특별시 용산구 한강대로92길 15, 1층(갈월동)",
    phoneNumber: "010-4331-7797",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    userType: "admin",
  };

  const data: IChatRoom = {
    users: [
      {
        id: adminUser.id!,
        name: adminUser.name!,
        nickName: adminUser.nickName,
        brandName: adminUser.brandName,
        profileImage: adminUser.profileImage,
      },
      {
        id: user.id!,
        name: user.name || "이거 없음?",
        nickName: user.nickName || "이거 없음?",
        brandName: user.brandName || "이거 없음?",
        profileImage: user.profileImage,
      },
    ],
    userIds: [adminUser.id!, user.id!],
    lastMessage: "아직 메세지가 없습니다",
    updatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    productId: "",
  };
  console.log("User object:", user);
  console.log("NickName:", user.nickName);
  console.log("BrandName:", user.brandName);

  try {
    console.log("Creating chat room with admin and user:", data);

    const chatroomId = randomUUID();
    await setDoc(doc(fireStore, COLLECTION_NAME_CHAT, chatroomId), data);

    console.log("Chat room created with ID:", chatroomId);

    return { status: 200, success: true, data: chatroomId };
  } catch (error) {
    console.error("Error while creating chatroom:", error);
    return {
      status: 400,
      success: false,
      message: `Error while creating chatroom: ${error}`,
    };
  }
}
