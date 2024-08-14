// "use client";

// import { showChatRoomListState } from "@/recoil/atoms";
// import { useRecoilValue } from "recoil";

// interface ChatRoomSectionProps {
//   children: React.ReactNode;
// }

// export default function ChatRoomSection({ children }: ChatRoomSectionProps) {
//   const showChatRoomList = useRecoilValue(showChatRoomListState);
//   return (
//     <section
//       className={`${
//         !showChatRoomList && "hidden"
//       } fixed mt-[72px] top-0 z-10 md:sticky  overflow-y-scroll scrollbar-hide w-full  md:w-96 bg-gray-100 px-6 py-8 border-r border-r-gray-200 md:block `}
//       style={{ height: "calc(100vh - 72px)" }}
//     >
//       {children}
//     </section>
//   );
// }

"use client";

import { showChatRoomListState } from "@/recoil/atoms";
import { useRecoilValue } from "recoil";
import { useSession } from "next-auth/react";

interface ChatRoomSectionProps {
  children: React.ReactNode;
}

const SkeletonChatRoom = () => (
  <div className="animate-pulse flex items-center gap-4 p-4">
    <div className="bg-gray-200 h-12 w-12 rounded-full" />
    <div className="flex-1">
      <div className="bg-gray-200 h-4 rounded w-1/2 mb-2" />
      <div className="bg-gray-200 h-4 rounded w-1/4" />
    </div>
  </div>
);

export default function ChatRoomSection({ children }: ChatRoomSectionProps) {
  const showChatRoomList = useRecoilValue(showChatRoomListState);
  const { status } = useSession();

  return (
    <section
      className={`${
        !showChatRoomList && "hidden"
      } fixed mt-[72px] top-0 z-10 md:sticky  overflow-y-scroll scrollbar-hide w-full  md:w-96 bg-gray-100 px-6 py-8 border-r border-r-gray-200 md:block `}
      style={{ height: "calc(100vh - 72px)" }}
    >
      {status === "loading"
        ? Array.from({ length: 30 }).map((_, index) => (
            <SkeletonChatRoom key={index} />
          ))
        : children}
    </section>
  );
}
