import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

export interface IChatRoom {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessage: string;
  userInfo: [string, string];
}

export const ChatRoomConverter = {
  toFirestore: (chatRoom: IChatRoom) => {
    return {
      lastMessage: chatRoom.lastMessage,
      userInfo: chatRoom.userInfo,
      createdAt: chatRoom.createdAt,
      updatedAt: chatRoom.updatedAt,
    };
  },

  fromFirestore: (chatRoom: DocumentSnapshot): IChatRoom => {
    const id = chatRoom.id;
    const data = chatRoom.data();
    return {
      id,
      lastMessage: data?.lastMessage,
      userInfo: data?.userInfo,
      createdAt: data?.createdAt,
      updatedAt: data?.updatedAt,
    };
  },
};
