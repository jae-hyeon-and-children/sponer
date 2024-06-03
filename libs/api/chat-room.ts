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

export async function createChatRoom(
  brand: IUser,
  stylelist: IUser,
  productId: string
): Promise<IResponse<string>> {
  const data: IChatRoom = {
    users: [
      { id: brand.id!, name: brand.name, profileImage: brand.profileImage },
      {
        id: stylelist.id!,
        name: stylelist.nickName ?? stylelist.name,
        profileImage: stylelist.profileImage,
      },
    ],
    userIds: [brand.id!, stylelist.id!],
    lastMessage: "아직 메세지가 없습니다",
    updatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    productId,
  };

  try {
    const chatroomId = randomUUID();
    await setDoc(doc(fireStore, COLLECTION_NAME_CHAT, chatroomId), data);

    return { status: 200, success: true, data: chatroomId };
  } catch (error) {
    return {
      status: 400,
      success: false,
      message: `Error white creating chatroom: ${error}`,
    };
  }
}
