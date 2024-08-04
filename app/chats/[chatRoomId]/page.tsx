"use client";

import ChatRoomList from "@/components/chats/chat-room-list";
import ChatRoomSection from "@/components/chats/chat-room-section";
import MessageForm from "@/components/chats/message-form";
import MessageHeader from "@/components/chats/message-header";
import MessageList from "@/components/chats/message-list";
import MessageSection from "@/components/chats/message-section";
import ProductSection from "@/components/chats/product-section";
import { chatRoomIdState, showChatRoomListState } from "@/recoil/atoms";
import Image from "next/image";
import IcClose from "@/public/icons/ic_close.png";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

interface ChatsParams {
  params: {
    chatRoomId: string;
  };
}

export default function Chats({ params: { chatRoomId } }: ChatsParams) {
  const setChatRoomId = useSetRecoilState(chatRoomIdState);
  const setShowChatRoomList = useSetRecoilState(showChatRoomListState);

  const handleSetChatRoom = () => setShowChatRoomList(false);

  useEffect(() => {
    setChatRoomId(chatRoomId);
    // window.scrollTo(0, 0); // 페이지 로드 시 스크롤 위치를 맨 위로 조정
  }, [chatRoomId, setChatRoomId]);

  return (
    <main className="flex h-screen">
      <ChatRoomSection>
        <div className="flex justify-between items-center mb-8">
          <h1 className="label-1 text-gray-600 ">All Messages</h1>
          <button onClick={handleSetChatRoom}>
            <Image
              src={IcClose}
              width={20}
              height={20}
              alt={"메뉴"}
              className="w-5 h-5 md:hidden block"
            />
          </button>
        </div>
        <ChatRoomList />
      </ChatRoomSection>
      <MessageSection>
        <MessageHeader />
        <div className="flex-1 flex flex-col overflow-y-scroll scrollbar-hide">
          <MessageList />
          <MessageForm />
        </div>
      </MessageSection>
      <ProductSection />
    </main>
  );
}
