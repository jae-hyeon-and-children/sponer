"use client";

import ChatRoom from "@/components/chats/chat-room";

import { fireStore } from "@/config/firebase/firebase";
import { COLLECTION_NAME_CHAT } from "@/constants/variables";
import { timeStampToDate } from "@/lib/utils/date";
import { ChatRoomConverter, IChatRoom } from "@/model/chat-room";
import { chatRoomIdState, chatRoomState } from "@/recoil/atoms";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";

export default function ChatRoomList() {
  const chatRoomId = useRecoilValue(chatRoomIdState);
  const setChatRoom = useSetRecoilState(chatRoomState);
  const [chatRooms, setChatRooms] = useState<IChatRoom[]>([]);

  useEffect(() => {
    const unSubscribeChatRooms = onSnapshot(
      query(
        collection(fireStore, COLLECTION_NAME_CHAT),
        where("userInfo", "array-contains", "test1"),
        orderBy("updatedAt", "desc")
      ),
      (snapshot) => {
        const convertedChatRooms = snapshot.docs.map((chatRoom) =>
          ChatRoomConverter.fromFirestore(chatRoom)
        );

        const selectedChatRoom = convertedChatRooms.find(
          (chatRoom) => chatRoom.id == chatRoomId
        );

        if (selectedChatRoom) setChatRoom(selectedChatRoom);
        setChatRooms(convertedChatRooms);
      }
    );

    return () => {
      unSubscribeChatRooms();
    };
  }, [chatRoomId, setChatRoom]);

  return (
    <ul className="flex flex-col gap-4">
      {chatRooms.map((value, index) => (
        <Link key={index} href={`/chats/${value.id}`}>
          <ChatRoom
            imageUrl={
              "https://flexible.img.hani.co.kr/flexible/normal/700/1040/imgdb/original/2021/0428/20210428504000.jpg"
            }
            name={value.userInfo[1]}
            message={value.lastMessage}
            sentDate={timeStampToDate(value.updatedAt)}
            isSelected={value.id === chatRoomId}
          />
        </Link>
      ))}
    </ul>
  );
}
