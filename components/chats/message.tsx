import { ContentType } from "@/constants/variables";
import { getDateTextWith } from "@/lib/utils/date";
import Image from "next/image";

interface MessageProps {
  content: string;
  contentType: ContentType;
  createdAt: Date;
  senderId: string;
}

export default function Message({
  content,
  contentType,
  createdAt,
  senderId,
}: MessageProps) {
  return (
    <li
      className={`flex items-end gap-3 ${
        senderId === "test1" ? "flex-row-reverse" : "flex--row"
      }`}
    >
      {contentType === ContentType.text && (
        <div
          className={`paragraph-1 ${
            senderId === "test1"
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
          alt="df"
          width={100}
          height={100}
          className={` ${
            senderId === "test1" ? "bg-gray-800" : "bg-gray-100"
          } rounded-lg p-6 w-full max-w-md`}
        />
      )}

      <span className="label-3 text-gray-300">
        {getDateTextWith(createdAt)}
      </span>
    </li>
  );
}
