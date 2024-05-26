"use client";

import ChatRoomList from "@/components/chats/chat-room-list";
import ChatRoomSection from "@/components/chats/chat-room-section";
import MessageForm from "@/components/chats/message-form";
import MessageHeader from "@/components/chats/message-header";
import MessageList from "@/components/chats/message-list";
import MessageSection from "@/components/chats/message-section";
import ProductSection from "@/components/chats/product-section";
import { chatRoomIdState } from "@/recoil/atoms";

import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

interface ChatsParams {
  params: {
    chatRoomId: string;
  };
}

export default function Chats({ params: { chatRoomId } }: ChatsParams) {
  const setChatRoomId = useSetRecoilState(chatRoomIdState);

  useEffect(() => {
    setChatRoomId(chatRoomId);
  }, [chatRoomId, setChatRoomId]);

  return (
    <main className="flex h-screen">
      <ChatRoomSection>
        <h1 className="label-1 text-gray-600 mb-8">All Messages</h1>
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
