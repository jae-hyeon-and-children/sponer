"use client";

import ChatRoom from "@/components/chats/chat-room";
import Message from "@/components/chats/message";
import { fireStore, storage } from "@/config/firebase/firebase";
import {
  COLLECTION_NAME_CHAT,
  COLLECTION_NAME_MESSAGE,
  CONTENT_TYPE,
  STORAGE_REF_CHAT_IMAGES,
} from "@/constants/variables";
import { ChatRoomConverter, IChatRoom } from "@/model/chat-room";
import { IMessage, MessageConverter } from "@/model/message";
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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { sendMessage } from "@/lib/api/chats";
import { useFormState } from "react-dom";
import { timeStampToDate } from "@/lib/utils/date";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import MessageForm from "./message-form";

interface MessageSectionProps {
  chatroomId: string;
}

export default function MessageSection({ chatroomId }: MessageSectionProps) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unSubscribe = onSnapshot(
      query(
        collection(
          fireStore,
          `${COLLECTION_NAME_CHAT}/${chatroomId}/${COLLECTION_NAME_MESSAGE}`
        ),
        orderBy("createdAt")
      ),
      (snapshot) => {
        const convertedMessages = snapshot.docs.map((message) =>
          MessageConverter.fromFirestore(message)
        );
        setMessages(convertedMessages);
      }
    );

    return () => unSubscribe();
  }, [chatroomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="flex-1 flex flex-col ">
      <div className="sticky top-0 bg-white border-b border-b-gray-200 flex justify-between items-center py-3 px-5">
        <div className="flex gap-4 items-center">
          <Image
            src={
              "https://flexible.img.hani.co.kr/flexible/normal/700/1040/imgdb/original/2021/0428/20210428504000.jpg"
            }
            width={24}
            height={24}
            alt={"상품 이미지"}
            className=" rounded-full w-6 h-6 object-cover"
          />
          <h2 className="heading-2 text-gray-800">오아이</h2>
        </div>
        <button className="caption text-gray-700 rounded-lg py-2 px-3 bg-gray-100">
          상품 보기
        </button>
      </div>
      <div className="flex-1 flex flex-col overflow-y-scroll scrollbar-hide">
        <ul className="px-6 py-4 flex-1 flex flex-col gap-5 justify-end ">
          {messages.map((value, index) => (
            <Message
              key={index}
              content={value.content}
              contentType={value.contentType}
              createdAt={timeStampToDate(value.createdAt)}
              senderId={value.senderId}
            />
          ))}
          <div ref={messagesEndRef} />
        </ul>

        <MessageForm chatroomId={chatroomId} />
      </div>
    </section>
  );
}
