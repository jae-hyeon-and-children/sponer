import { ContentType } from "@/constants/variables";
import { getDateTextWith } from "@/libs/utils/date";
import Image from "next/image";

interface MessageProps {
  content: string;
  contentType: ContentType;
  createdAt: Date;
  senderId: string;
  userId: string;
}

export default function Message({
  content,
  contentType,
  createdAt,
  senderId,
  userId,
}: MessageProps) {
  return (
    <li
      className={`flex items-end gap-3 ${
        senderId === userId ? "flex-row-reverse" : "flex--row"
      }`}
    >
      {contentType === ContentType.text && (
        <div
          className={`paragraph-1 ${
            senderId === userId
              ? "text-gray-50 bg-gray-800"
              : "text-gray-800 bg-gray-100"
          } rounded-lg py-4 px-6  max-w-md`}
        >
          {content}
        </div>
      )}
      {contentType === ContentType.image && (
        <Image
          src={content}
          alt="이미지"
          width={400}
          height={400}
          quality={100}
          className={` ${
            senderId === userId ? "bg-gray-800" : "bg-gray-100"
          } rounded-lg p-6 w-full max-w-md`}
        />
      )}

      <span className="label-3 text-gray-300">
        {getDateTextWith(createdAt)}
      </span>
    </li>
  );
}
