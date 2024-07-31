// import { ContentType } from "@/constants/variables";
// import { getDateTextWith } from "@/libs/utils/date";
// import Image from "next/image";

// interface MessageProps {
//   content: string;
//   contentType: ContentType;
//   createdAt: Date;
//   senderId: string;
//   userId: string;
// }

// export default function Message({
//   content,
//   contentType,
//   createdAt,
//   senderId,
//   userId,
// }: MessageProps) {
//   return (
//     <li
//       className={`flex items-end gap-3 ${
//         senderId === userId ? "flex-row-reverse" : "flex--row"
//       }`}
//     >
//       {contentType === ContentType.text && (
//         <div
//           className={`paragraph-1 ${
//             senderId === userId
//               ? "text-gray-50 bg-gray-800"
//               : "text-gray-800 bg-gray-100"
//           } rounded-lg py-4 px-6  max-w-md`}
//         >
//           {content}
//         </div>
//       )}
//       {contentType === ContentType.image && (
//         <Image
//           src={content}
//           alt="이미지"
//           width={400}
//           height={400}
//           quality={100}
//           className={` ${
//             senderId === userId ? "bg-gray-800" : "bg-gray-100"
//           } rounded-lg p-6 w-full max-w-md`}
//         />
//       )}

//       <span className="label-3 text-gray-300">
//         {getDateTextWith(createdAt)}
//       </span>
//     </li>
//   );
// }

import { ContentType } from "@/constants/variables";
import { getDateTextWith } from "@/libs/utils/date";
import Image from "next/image";

interface MessageProps {
  id?: string;
  content: string;
  contentType: ContentType;
  createdAt: Date;
  senderId: string;
  userId: string;
  readBy: string[];
}

export default function Message({
  id,
  content,
  contentType,
  createdAt,
  senderId,
  userId,
  readBy,
}: MessageProps) {
  const isReadByOther = Array.isArray(readBy) ? readBy.includes(userId) : false;

  return (
    <li
      className={`flex items-end gap-3 ${
        senderId === userId ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {contentType === ContentType.text && (
        <div
          className={`paragraph-1 ${
            senderId === userId
              ? "text-gray-50 bg-gray-800"
              : "text-gray-800 bg-gray-100"
          } rounded-lg py-4 px-6 max-w-md relative whitespace-pre-line`}
        >
          {content}
        </div>
      )}
      {contentType === ContentType.image && (
        <div className="relative max-w-md">
          <Image
            src={content}
            alt="이미지"
            width={400}
            height={400}
            quality={100}
            className={`${
              senderId === userId ? "bg-gray-800" : "bg-gray-100"
            } rounded-lg p-6 w-full object-cover`}
          />
        </div>
      )}
      <div className="flex flex-col items-center text-xs text-gray-400">
        <span>{getDateTextWith(createdAt)}</span>
        {senderId !== userId && (
          <span className={isReadByOther ? "visible" : "hidden"}>읽음</span>
        )}
      </div>
    </li>
  );
}
