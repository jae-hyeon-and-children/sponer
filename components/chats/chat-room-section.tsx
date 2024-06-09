"use client";

import { showChatRoomListState } from "@/recoil/atoms";
import { useRecoilValue } from "recoil";

interface ChatRoomSectionProps {
  children: React.ReactNode;
}

export default function ChatRoomSection({ children }: ChatRoomSectionProps) {
  const showChatRoomList = useRecoilValue(showChatRoomListState);
  return (
    <section
      className={`${
        !showChatRoomList && "hidden"
      }  sticky z-10 h-screen md:sticky top-0 overflow-y-scroll scrollbar-hide w-full md:w-96 bg-gray-100 px-6 py-8 border-r border-r-gray-200 md:block`}
    >
      {children}
    </section>
  );
}
