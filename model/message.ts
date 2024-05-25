import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { ContentType } from "@/constants/variables";

export interface IMessage {
  id?: string;
  createdAt: Timestamp;
  content: string;
  contentType: ContentType;
  senderId: string;
}

export const MessageConverter = {
  toFirestore: (message: IMessage) => {
    return {
      content: message.content,
      contentType: message.contentType,
      createdAt: message.createdAt,
      senderId: message.senderId,
    };
  },

  fromFirestore: (message: DocumentSnapshot): IMessage => {
    const id = message.id;
    const data = message.data();
    return {
      id,
      content: data?.content,
      contentType: data?.contentType,
      createdAt: data?.createdAt,
      senderId: data?.senderId,
    };
  },
};
