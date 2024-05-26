import { ContentType } from "@/constants/variables";
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

export interface IMessage {
  id?: string;
  createdAt: Timestamp;
  content: string;
  contentType: ContentType;
  senderId: string;
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
    };
  },
};
