// import { getDateTextWith } from "@/libs/utils/date";
// import Image from "next/image";
// import Link from "next/link";

// interface ChatRoomProps {
//   imageUrl: string;
//   name: string;
//   message: string;
//   sentDate: Date;
//   isSelected?: boolean;
// }

// export default function ChatRoom({
//   imageUrl,
//   name,
//   message,
//   sentDate,
//   isSelected = true,
// }: ChatRoomProps) {
//   return (
//     <li
//       className={`flex bg w-full ${
//         isSelected ? "bg-primary" : "bg-white"
//       } p-5 rounded-lg items-center`}
//     >
//       <Image
//         src={imageUrl}
//         width={24}
//         height={24}
//         alt={"상품 이미지"}
//         className="mr-4 rounded-full w-9 h-9 object-cover"
//       />

//       <div className="flex flex-col gap-1 flex-1 overflow-hidden">
//         <div className="flex justify-between items-baseline gap-2">
//           <h2
//             className={`heading-3 truncate ${
//               isSelected ? "text-gray-100" : "text-gray-500"
//             } `}
//           >
//             {name}
//           </h2>
//           <span className="label-3 text-gray-300">
//             {getDateTextWith(sentDate)}
//           </span>
//         </div>
//         <p
//           className={`paragraph-2 truncate ${
//             isSelected ? "text-gray-100" : "text-gray-500"
//           } `}
//         >
//           {message}
//         </p>
//       </div>
//     </li>
//   );
// }

import { getDateTextWith } from "@/libs/utils/date";
import Image from "next/image";

interface ChatRoomProps {
  imageUrl: string;
  name: string;
  message: string;
  sentDate: Date;
  isSelected?: boolean;
  unreadCount: number;
}

export default function ChatRoom({
  imageUrl,
  name,
  message,
  sentDate,
  isSelected = true,
  unreadCount,
}: ChatRoomProps) {
  return (
    <li
      className={`flex bg w-full ${
        isSelected ? "bg-primary" : "bg-white"
      } p-5 rounded-lg items-center`}
    >
      <Image
        src={imageUrl}
        width={24}
        height={24}
        alt={"상품 이미지"}
        className="mr-4 rounded-full w-9 h-9 object-cover"
      />

      <div className="flex flex-col gap-1 flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline gap-2">
          <h2
            className={`heading-3 truncate ${
              isSelected ? "text-gray-100" : "text-gray-500"
            } `}
          >
            {name}
          </h2>
          <span className="label-3 text-gray-300">
            {getDateTextWith(sentDate)}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <p
            className={`paragraph-2 truncate flex-1 ${
              isSelected ? "text-gray-100" : "text-gray-500"
            } `}
          >
            {message}
          </p>
          {unreadCount > 0 && (
            <span className="text-red-500 text-sm font-bold ml-2">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
