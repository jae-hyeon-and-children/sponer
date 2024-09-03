// import { ContentType } from "@/constants/variables";
// import { DocumentSnapshot, Timestamp } from "firebase/firestore";

// export interface IMessage {
//   id?: string;
//   createdAt: Timestamp;
//   content: string;
//   contentType: ContentType;
//   senderId: string;
//   readBy: string[]; // 읽은 사용자들의 ID 배열
// }

// export const MessageConverter = {
//   fromFirestore: (message: DocumentSnapshot): IMessage => {
//     const id = message.id;
//     const data = message.data();
//     return {
//       id,
//       content: data?.content,
//       contentType: ContentType[data?.contentType as keyof typeof ContentType],
//       createdAt: data?.createdAt,
//       senderId: data?.senderId,
//       readBy: data?.readBy ?? [], // 기본값 빈 배열
//     };
//   },
// };

import { ContentType } from "@/constants/variables";
import { DocumentSnapshot, Timestamp } from "firebase/firestore";

export interface IMessage {
  id?: string;
  createdAt: Timestamp;
  content: string;
  contentType: ContentType;
  senderId: string;
  readBy: string[]; // 읽은 사용자들의 ID 배열
}

export const MessageConverter = {
  fromFirestore: (message: DocumentSnapshot): IMessage => {
    const id = message.id;
    const data = message.data();
    return {
      id,
      content: data?.content,
      contentType: ContentType[data?.contentType as keyof typeof ContentType],
      createdAt: data?.createdAt,
      senderId: data?.senderId,
      readBy: Array.isArray(data?.readBy) ? data.readBy : [], // 기본값 빈 배열
    };
  },
};
