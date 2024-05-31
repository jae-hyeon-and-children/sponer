"use client";

import ChatRoom from "@/components/chats/chat-room";

import { fireStore } from "@/config/firebase/firebase";
import { COLLECTION_NAME_CHAT } from "@/constants/variables";
import { getProduct } from "@/libs/api/product";
import { timeStampToDate } from "@/libs/utils/date";
import { ChatRoomConverter, IChatRoom } from "@/model/chat-room";
import {
  chatRoomIdState,
  chatRoomProductState,
  chatRoomUserState,
} from "@/recoil/atoms";
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
  const userId = "123";
  const chatRoomId = useRecoilValue(chatRoomIdState);
  const setChatRoomUser = useSetRecoilState(chatRoomUserState);
  const setChatRoomProduct = useSetRecoilState(chatRoomProductState);
  const [chatRooms, setChatRooms] = useState<IChatRoom[]>([]);

  const getOtherUser = (chatRoom: IChatRoom) =>
    chatRoom.users.find((user) => user.id !== userId);

  useEffect(() => {
    const unSubscribeChatRooms = onSnapshot(
      query(
        collection(fireStore, COLLECTION_NAME_CHAT),
        where("userIds", "array-contains", userId),
        orderBy("updatedAt", "desc")
      ),
      (snapshot) => {
        const convertedChatRooms = snapshot.docs.map((chatRoom) =>
          ChatRoomConverter.fromFirestore(chatRoom)
        );

        const selectedChatRoom = convertedChatRooms.find(
          (chatRoom) => chatRoom.id == chatRoomId
        );

        if (selectedChatRoom) {
          const otherUser = getOtherUser(selectedChatRoom);
          setChatRoomUser(otherUser!);

          const fetchProduct = async () => {
            if (selectedChatRoom.productId) {
              const res = await getProduct(selectedChatRoom.productId);
              setChatRoomProduct(res.data ?? null);
            }
          };

          fetchProduct();
        }
        setChatRooms(convertedChatRooms);
      }
    );

    return () => {
      unSubscribeChatRooms();
    };
  }, [chatRoomId, setChatRoomProduct, setChatRoomUser]);

  return (
    <ul className="flex flex-col gap-4">
      {chatRooms.map((value, index) => {
        const otherUser = getOtherUser(value);
        return (
          <Link key={index} href={`/chats/${value.id}`}>
            <ChatRoom
              imageUrl={otherUser!.profileImage}
              name={otherUser!.name}
              message={value.lastMessage}
              sentDate={timeStampToDate(value.updatedAt)}
              isSelected={value.id === chatRoomId}
            />
          </Link>
        );
      })}
    </ul>
  );
}
