"use server";

import { fireStore } from "@/config/firebase/firebase";
import {
  COLLECTION_NAME_CHAT,
  COLLECTION_NAME_MESSAGE,
  ContentType,
} from "@/constants/variables";
import { IMessage, MessageConverter } from "@/model/message";

import { IProduct, ProductConverter } from "@/model/product";
import { IResponse } from "@/model/responses";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function fetchChatRooms() {}

export async function fetchChatRoom() {}

export async function fetchMessages(id: string) {
  try {
    const messagesSnapshot = onSnapshot(
      doc(fireStore, COLLECTION_NAME_CHAT, id),
      (doc) => {
        console.log("Current data: ", doc.data());
      }
    );

    return { status: 200, success: true, data: messagesSnapshot };
  } catch (error) {
    return {
      status: 400,
      success: false,
      message: `Error white fetching messages id ${id}: ${error}`,
    };
  }
}

export async function sendMessage(
  chatRoomId: string,
  content: string,
  contentType: ContentType
) {
  const data: IMessage = {
    senderId: "test1",
    content,
    contentType,
    createdAt: Timestamp.fromDate(new Date()),
  };

  try {
    await addDoc(
      collection(
        fireStore,
        `${COLLECTION_NAME_CHAT}/${chatRoomId}/${COLLECTION_NAME_MESSAGE}`
      ),
      data
    );

    await updateDoc(doc(fireStore, COLLECTION_NAME_CHAT, chatRoomId), {
      lastMessage: contentType === ContentType.text ? content : "이미지",
      updatedAt: Timestamp.fromDate(new Date()),
    });

    return { status: 200, success: true };
  } catch (error) {
    return {
      status: 400,
      success: false,
      message: `Error white fetching sending message chatRoomId ${chatRoomId}: ${error}`,
    };
  }
}
