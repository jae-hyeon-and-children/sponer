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
      } fixed mt-[72px] top-0 z-10 md:sticky  overflow-y-scroll scrollbar-hide w-full  md:w-96 bg-gray-100 px-6 py-8 border-r border-r-gray-200 md:block `}
      style={{ height: "calc(100vh - 72px)" }}
    >
      {children}
    </section>
  );
}
