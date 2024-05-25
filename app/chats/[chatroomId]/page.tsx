"use client";

import ChatRoom from "@/components/chats/chat-room";
import MessageSection from "@/components/chats/message-section";
import { fireStore } from "@/config/firebase/firebase";
import { COLLECTION_NAME_CHAT } from "@/constants/variables";
import { timeStampToDate } from "@/lib/utils/date";
import { ChatRoomConverter, IChatRoom } from "@/model/chat-room";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ChatsParams {
  params: {
    chatroomId: string;
  };
}

export default function Chats({ params: { chatroomId } }: ChatsParams) {
  const [chatrooms, setChatRooms] = useState<IChatRoom[]>([]);

  // 채팅방 리스트 불러오기(사용자 id, updatedAt 순으로)
  useEffect(() => {
    console.log("d??");
    const unSubscribeChatRooms = onSnapshot(
      query(
        collection(fireStore, COLLECTION_NAME_CHAT),
        where("userInfo", "array-contains", "test1"),
        orderBy("updatedAt", "desc")
      ),
      (snapshot) => {
        const convertedChatrooms = snapshot.docs.map((chatroom) =>
          ChatRoomConverter.fromFirestore(chatroom)
        );
        console.log("???");
        console.log(convertedChatrooms);
        setChatRooms(convertedChatrooms);
      }
    );

    return () => {
      unSubscribeChatRooms();
    };
  }, []);

  return (
    <main className="flex h-screen">
      <section className="sticky top-0 overflow-y-scroll scrollbar-hide w-96 bg-gray-100 px-6 py-8 border-r border-r-gray-200">
        <h1 className="label-1 text-gray-600 mb-8">All Messages</h1>
        <ul className="flex flex-col gap-4">
          {chatrooms.map((value, index) => (
            <Link key={index} href={`/chats/${value.id}`}>
              <ChatRoom
                imageUrl={
                  "https://flexible.img.hani.co.kr/flexible/normal/700/1040/imgdb/original/2021/0428/20210428504000.jpg"
                }
                name={value.userInfo[1]}
                message={value.lastMessage}
                sentDate={timeStampToDate(value.updatedAt)}
                isSelected={value.id === chatroomId}
              />
            </Link>
          ))}
        </ul>
      </section>
      <MessageSection chatroomId={chatroomId} />

      <section className="sticky top-0 overflow-y-scroll scrollbar-hide w-96 bg-white px-6 py-8 border-r border-r-gray-200 hidden">
        <h1 className="label-1 text-gray-600 mb-8">상품 기록</h1>
        <ul className="flex flex-col gap-4">
          <li>
            <p> 상품 이름</p>
            <p>날짜</p>
          </li>
        </ul>
      </section>
    </main>
  );
}
